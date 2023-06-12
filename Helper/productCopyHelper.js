const cartdb = require('../model/cartdb')
const orderdb = require('../model/orderdb')
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

// Copy product IDs from cartdb to orderdb
async function copyProductIds(session,cartid,addressid,grandtotal,paymentmethod){
  try {
    const address=new ObjectId(addressid)
    const paymentMethod=paymentmethod
    console.log(paymentMethod);
    const cartDocument = await cartdb.findOne({userId:new ObjectId(session)}).populate('product.product_id')
    console.log(cartDocument);
    console.log("products in the cart is :   "+cartDocument._id);
    
    
    console.log("Products in the cart:");

    const products = cartDocument.product.map(item => {
      return {
        name: item.product_id.name,
        price: item.product_id.price,
        quantity: item.quantity,
        image: item.product_id.image
      }
    });
console.log(products);
  

    console.log("11111111111111111111111111111111111111111111111111111111111111111");
    const Cartid = cartDocument._id

    const orderProductArray = [];

    const newOrder = new orderdb({
                                  userId: new ObjectId(session),
                                  orderProducts: products,
                                  grandtotal: grandtotal, // Implement a function to calculate the grand total
                                  paymentmethod: paymentMethod,
                                  address: address
                                   });
    
    // Save the new order document
    const savedOrder = await newOrder.save();   
    
    console.log("The saved order is :   "+savedOrder._id);
    return savedOrder;

  } catch (error) {
    console.error('Error copying product IDs:', error);
  }

}


module.exports = {copyProductIds}
