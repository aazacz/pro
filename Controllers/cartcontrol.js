const categorydb        = require("../model/categorydb")
const productdb         = require('../model/productsdb')
const cartdb            = require('../model/cartdb')
const customerdetail    = require('../model/userdetailsdb')
const orderdb           = require('../model/orderdb')
const mongoose          = require('mongoose');
const { ObjectId }      = mongoose.Types;
const productCopyHelper = require("../Helper/productCopyHelper")
const cartHelper        = require("../Helper/cartHelper")
const Razorpay          = require("razorpay")
const walletdb          = require('../model/walletdb')
const bannerdb          = require('../model/bannerdb')


//cart page loading
exports.cart     = async (req, res) => {
  const session  = req.session.userid
  const banners  = await bannerdb.findOne({})
  const user     = await customerdetail.findOne({ _id: req.session.userid }).populate('address').populate('cartId')
  const cart     = await cartdb.find({ userId: req.session.userid }).populate('product.product_id');
  const miniCart = await cartdb.findOne({ userId: req.session.userid }).populate('product.product_id').exec()

  res.render('cart', { session: session, cart: cart, user: user, miniCart: miniCart, banners: banners })
}



//adding to the CART
exports.addtocart = async (req, res) => {
  const id          = req.body._id;
 
  try {
    //checking whether User have a cart or not 
    let cartExist    = await cartdb.findOne({ userId: req.session.userid });
    console.log("user cart found");

    if (cartExist) {  //If User have already a cart

      const isProductExist = await cartdb.findOne({ userId: req.session.userid, "product.product_id": new ObjectId(id) });
      
      if (!isProductExist) { //Executes the IF Condition if the product is not already existed in the cart
        console.log("product does not exist in the cart");
        const cartId    = await cartdb.find({ userId: req.session.userid });
        const productId = id
        const quantity  = 1;

        // addToCartHelper
        const addtocart = await cartHelper.addToCart(cartId, productId)

        if (addtocart) {
                      console.log('Product added to the cart:', addtocart);
                      res.send({ message: 'Product added' });
        } else {
                      console.log('Error adding product to the cart');
                      res.send({ message: 'Error adding product to the cart' });
        }
        console.log("if condition worked");
        return;

      }else {
        res.send({ message: "product already added" })
        return;
      }

    }
    else {

      /* This else case works in case the cart is not already created and User is purchasing for the first time */
      const productData = {
        product_id: id,
        quantity: 1
      };

      const addtocart = new cartdb({ userId: req.session.userid, product: [] }); //creating a new cart 

      await addtocart.product.push(productData);//push the new product in to the cart
      console.log("The newly created cartId is: " + newcart._id);

      const newcart   = await addtocart.save()
                                            .then(savedCart => { console.log('the saved cart is :', savedCart)  })
                                            .catch(error => {  console.log("Error saving the cart", error.message);})


      //adding the newly created cartid to the users mongodb
      const addtouser = await customerdetail.findByIdAndUpdate(req.session.userid, { cartId: newcart._id }, { new: true });
      console.log(addtouser);
      res.send({ message: "Product added" })
      return;
    }
  } catch (error) {
    console.log(error.message);
  }
};


//increaseQuantity of cart
exports.increaseQuantity = async (req, res) => {
  try {
    const productId     = req.body.id;
    const incQuantity   = parseInt(req.body.currentQuantity) + 1;
    const userId        = req.session.userid;

    //find the cart quantity
    const product       = await productdb.findOne({ _id: req.body.id })
   
    if (incQuantity <= product.quantity) {

      let cart          = await cartdb.findOne({ userId: userId }); //finding the cart 
      const cartid      = cart._id
      let qtyToIncrease = 1
      const quantityset = await cartdb.findOneAndUpdate({ _id: cartid, 'product.product_id': productId },
                                                        { $inc: { 'product.$.quantity': qtyToIncrease } }, 
                                                        { new: true }).exec()
      console.log(":if condition");

      res.send({ message: "incremented" })
    }
    else {
      console.log("else condition");
      res.send({ message: "out of quantity" })
    }

    console.log("productid is: " + productId + " Qty to increase is: " + incQuantity + "  user Id is: " + userId);
  } catch (error) {
    console.log(error.message);
  }
}


//decreaseQuantity of cart
exports.decreaseQuantity = async (req, res) => {
  try {
    const value       = req.body.value
    const productId   = req.body.id;
    const decQuantity = req.body.decQuantity;
    const userId      = req.session.userid
    
    console.log("productid is: " + productId + " Qty to decrease is: " + decQuantity + "  user Id is: " + userId);

    if (value == 1) {
      res.send({ message: "decremented" })
    }
    else {
      //calling Cart helper 
      await cartHelper.decreaseQty(productId, decQuantity, userId)
      res.send({ message: "decremented" })
    }


  } catch (error) {
    console.log(error.message);
  }
}



//Deleting from the cart
exports.cartdel = async (req, res) => {

  try {
    const productId    = new ObjectId(req.body.id);
    const cartid       = req.body.cartid

  
    const productdel   = await cartHelper.productDelete(cartid, productId)   // calling Cart Helper

    if (productdel) {res.send({ message: "deleted" })}
    else {res.send({ message: "not deleted" })}

  } catch (error) {
    console.log(error.message)
  }
}


//POST-checkout
exports.checkout = async (req, res) => {
  try {
    console.log("cash on delivery")
    console.log("post checkout")
    let cartid        = req.body.cartId;
    let addressid     = req.body.address;
    let grandtotal    = req.body.grandPrice;
    let paymentmethod = req.body.paymentmethod;
    const session     = req.session.userid
    
    //calling helper function
    const { orderdbId, productids } = await productCopyHelper.copyProductIds(session, cartid, addressid, grandtotal, paymentmethod);
    const orderdb_Id  = orderdbId._id
    const productIds  = productids
    
    const addUserId   = await orderdb.findByIdAndUpdate(orderdb_Id, { $set: { userId: req.session.userid, payment: "Paid" } })
    console.log("new userid added to orderdb   &   user paid the Amount");

    const addtouser   = await customerdetail.findByIdAndUpdate(req.session.userid, { myorderId: orderdb_Id }, { new: true });
    console.log("new orderId added to customerDB")

    res.send({ message: "ordered successfully", orderdb_Id: orderdb_Id, cartid: cartid, productIds: productIds })

  } catch (error) {
    console.log(error.messsage);
  }
}


//POST-checkout Wallet Checkout
exports.walletCheckout = async (req, res) => {
  try {
    let cartid        = req.body.cartId;
    let addressid     = req.body.address;
    let grandtotal    = req.body.grandPrice;
    let paymentmethod = req.body.paymentmethod;
    const session     = req.session.userid

    console.log("session is " + session);


    const { orderdbId, productids } = await productCopyHelper.copyProductIds(session, cartid, addressid, grandtotal, paymentmethod);
    
    const orderdb_Id  = orderdbId._id
    const productIds  = productids
    
    const addUserId   = await orderdb.findByIdAndUpdate(orderdb_Id, { $set: { userId: req.session.userid, payment: "Paid" } })
    console.log("new userid added to orderdb   &   user paid the Amount");

    const addtouser   = await customerdetail.findByIdAndUpdate(req.session.userid, { myorderId: orderdb_Id }, { new: true });
    console.log("new orderId added to customerDB")

    const minusFromWallet = await walletdb.findOneAndUpdate({ userId: new ObjectId(session) }, { $inc: { amount: -grandtotal } }, { new: true }).exec()

    res.send({ message: "ordered successfully", orderdb_Id: orderdb_Id, cartid: cartid, productIds: productIds })

  } catch (error) {
    console.log(error.messsage);
  }
}



//returning the order
exports.returnorder = async (req, res) => {

  try {
    const orderid      = req.body.id

    const return_item  = await orderdb.findByIdAndUpdate(orderid, { $set: { status: "req for Return" } });
    res.send({ message: "returned" })
  } catch (error) {
    console.log(error.message);
  }

}