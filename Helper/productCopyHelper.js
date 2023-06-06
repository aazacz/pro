const cartdb = require('../model/cartdb')
const orderdb = require('../model/orderdb')
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

// Copy product IDs from cartdb to orderdb
async function copyProductIds(session,cartid,addressid,grandtotal,paymentmethod){
  try {
    const address=new ObjectId(addressid)
    const cartDocument = await cartdb.findOne({userId:new ObjectId(session)})
    console.log("products in the cart is :   "+cartDocument._id);
    const Cartid=cartDocument._id

  
     
    const orderProductArray = [];
    
    cartDocument.product.forEach((cartProduct) => {
      
       const orderProduct = {                    // Create a new product object with the product_id and quantity
         product_id: cartProduct.product_id,
         quantity: cartProduct.quantity
       };
     
      
       orderProductArray.push(orderProduct);     // Push the orderProduct to the orderProductArray
     });


     const newOrder = new orderdb({
                                  userId: cartDocument.userId,
                                  product: orderProductArray,
                                  grandtotal: grandtotal,
                                  paymentmethod: paymentmethod,
                                  address:address,
                                  
                                   });
    
    
    const savedOrder = await newOrder.save();   // Save the new order document
    
    // removing the product from the cart Document 

   /*  const updatedCart = await Cart.updateOne(
      { _id: cartId },
      { $set: { product: [] } }
    );
    
    console.log("the updated cart is : "+updatedCart); */
    
  
    console.log("The saved order is :   "+savedOrder._id);

    return savedOrder;

  } catch (error) {
    console.error('Error copying product IDs:', error);
  }

}


module.exports = {copyProductIds}
