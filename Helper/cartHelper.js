const cartdb = require('../model/cartdb')
const customerdetail = require('../model/userdetailsdb')
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;



async function addToCart(cartId, productId) {

  const addtocart = await cartdb.findByIdAndUpdate(cartId, {
    $addToSet: {
      product: {
        product_id: new mongoose.Types.ObjectId(productId),
        quantity: 1
      }
    }
  }, { new: true, upsert: true });
     return addtocart
}



async function increaseQty(productId, incQuantity, userId) {
   let cart = await cartdb.findOne({ userId: userId });
   const cartid = cart._id
   console.log(cartid);
   console.log("productid is: " + productId + " Qty to increase is: " + incQuantity + "  user Id is: " + userId);

   const quantityset=await cartdb.findOneAndUpdate({_id:cartid, 'product.product_id': productId },
                                 { $inc: { 'product.$.quantity': incQuantity } },{ new:true }).exec()
  console.log(quantityset);
   return quantityset;

}


async function decreaseQty(productId, decQuantity, userId) {
   let cart = await cartdb.findOne({ userId: userId });
   const cartid = cart._id
   console.log(cartid);
   console.log("productid is: " + productId + " Qty to decrease is: " + decQuantity + "  user Id is: " + userId);

   const quantityset=await cartdb.findOneAndUpdate({_id:cartid, 'product.product_id': productId },
                                 { $inc: { 'product.$.quantity': -decQuantity } },{ new:true }).exec()
  console.log(quantityset);
  return quantityset;

}




async function productDelete(cartid,productId){
  console.log("cart helper called");
  const find = await cartdb.findOne({_id: cartid , "product.productId":productId })
  console.log("the product inthe cart is: " +find)

  const productdel =await cartdb.findOneAndUpdate({_id:cartid, 'product.product_id': productId },{ $pull: { product:{product_id: productId}}}, { new: true }).exec()

  return productdel
  }



module.exports = {
  addToCart,
  increaseQty,
  decreaseQty,
  productDelete

}