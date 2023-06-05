const categorydb = require("../model/categorydb")
const productdb = require('../model/productsdb')
const cartdb = require('../model/cartdb')
const customerdetail = require('../model/userdetailsdb')
const orderdb = require('../model/orderdb')
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const productCopyHelper = require("../Helper/productCopyHelper")
const cartHelper = require("../Helper/cartHelper")

//cart page loading
exports.cart = async (req, res) => {
  const session = req.session.userid
  console.log("session id in the cart page is:    "+session);
  

  
  const user = await customerdetail.findOne({ _id: req.session.userid }).populate('address').populate('cartId')

  const cart = await cartdb.find({userId:req.session.userid}).populate('product.product_id');
 
  const miniCart= await cartdb.findOne({userId:req.session.userid}).populate('product.product_id').exec()

  res.render('cart', { session: session, cart: cart, user: user,miniCart:miniCart })
}



//adding to the CART
exports.addtocart = async (req, res) => {
  const id = req.body._id;
  console.log("id of product item is:        " + id);

  try {
    //checking whether User have a cart or not 
    let cartExist = await cartdb.findOne({ userId: req.session.userid });
    console.log("user cart found");

    if (cartExist) {  //If User have already a cart

      const isProductExist = await cartdb.findOne({ userId: req.session.userid, "product.product_id": new ObjectId(id) });
      console.log("PRODUCT FOUND IS:  " + isProductExist);

      if (!isProductExist) { //Executes the IF Condition if the product is not already existed in the cart
        console.log("product does not exist in the cart");
        const cartId = await cartdb.find({ userId: req.session.userid });
        const productId = id
        const quantity = 1;
//abhilash abinz 
        // addToCartHelper
        const addtocart= await cartHelper.addToCart(cartId, productId)
        
        if (addtocart) {
            console.log('Product added to the cart:', addtocart);
            res.send({ message: 'Product added' });
        } else {
            console.log('Error adding product to the cart');
            res.send({ message: 'Error adding product to the cart' });
              }

        console.log("if condition worked");
        return;

      }
      else {
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

      //creating a new cart 
      const addtocart = new cartdb({ userId: req.session.userid, product: [] });

      //push the new product in to the cart
      await addtocart.product.push(productData);
      console.log("The newly created cartId is: " + newcart._id);

      const newcart = await addtocart.save()
        .then(savedCart => {
          console.log('the saved cart is :', savedCart)
        })
        .catch(error => {
          console.log("Error saving the cart", error.message);
        })


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
    const productId = req.body.id;
    const incQuantity = req.body.incQuantity;
    const userId = req.session.userid;
    console.log("productid is: " + productId + " Qty to increase is: " + incQuantity + "  user Id is: " + userId);

    const quantityset=await cartHelper.increaseQty(productId, incQuantity, userId)
    
    if (quantityset) {
      // Cart updated successfully
      console.log(quantityset);
      res.send({ message: "incremented" })
    } else {
      
      console.log("Cart not found");
     
    }
    
  } catch (error) {
    console.log(error.message);
  }
}


//decreaseQuantity of cart
exports.decreaseQuantity = async (req, res) => {
  try {
    const value=req.body.value
    const productId = req.body.id;
    const decQuantity = req.body.decQuantity;
    const userId = req.session.userid
    console.log("productid is: " + productId + " Qty to decrease is: " + decQuantity + "  user Id is: " + userId);

    if(value<2){
      res.send({ message: "decremented" })
    }
    else{

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
    const productId = new ObjectId(req.body.id);
    const cartid = req.body.cartid
    console.log("the product Id is: "+ productId+ "\n cart ID is :"+ cartid)

  // calling Cart Helper
  const productdel=await cartHelper.productDelete(cartid,productId)
  
  if(productdel){
  res.send({ message: "deleted" })
    }
  else{
  res.send({ message: "not deleted" })
    }

  } catch (error) {
    console.log(error.message)
  }
}


//POST-checkout
exports.checkout = async (req, res) => {
  try {
    console.log("post checkout")
    let cartid = req.body.cartId;
    let addressid = req.body.address;
    let grandtotal = req.body.grandPrice;
    let paymentmethod = req.body.paymentmethod;

    const session = req.session.userid
    console.log("session is " + session);

    const orderdbId = await productCopyHelper.copyProductIds();
    const orderdb_Id = orderdbId[0]._id
    console.log("the orderdb id is  " + orderdb_Id)

    const addUserId = await orderdb.findByIdAndUpdate(orderdb_Id, { userId: req.session.userid })
    console.log("new userid added to orderdb");

    const addtouser = await customerdetail.findByIdAndUpdate(req.session.userid, { myorderId: orderdb_Id }, { new: true });
    console.log("new orderId added to customerDB");

    //  console.log(addtouser);

    res.send({ message: "ordered successfully" })




  } catch (error) {
    console.log(error.messsage);
  }
}