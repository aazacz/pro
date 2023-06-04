const cartdb = require('../model/cartdb')
const orderdb = require('../model/orderdb')


// Copy product IDs from cartdb to orderdb
async function copyProductIds() {
  try {
    const carts = await cartdb.find({}); // get all documents from cartdb
    // console.log(carts);

    
    const productIds = carts.map(cart => cart.product); // Extracting product IDs from cart documents
    // console.log(productIds)
    
    
    const orders = productIds.map(productid => ({ //inserting the productIDs in to the orderDb
      product: productid,
      quantity: 1 // Replace with the appropriate value
    }));
    
    // Insert order documents into orderdb
    const orderdbId = await orderdb.insertMany(orders);
    console.log(orderdbId);
    console.log('Product IDs copied successfully.');
    return orderdbId;

  } catch (error) {
    console.error('Error copying product IDs:', error);
  }
}

// Call the copyProductIds function
module.exports = {copyProductIds}
