const wishlistdb=require('../model/wishlistdb')
const mongoose=require('mongoose')
const {ObjectId}=mongoose.Types



async function addToWishlist(userId,productid){
 
 const wishlist = await wishlistdb.findOne({ userId: userId });
 
console.log("wishlist is"+wishlist);
const addtowishlist = await wishlistdb.findByIdAndUpdate(
                                {_id:wishlist._id}, 
                                {$addToSet: { product: new mongoose.Types.ObjectId(productid) }},
                                { new: true, upsert: true });

console.log("addtowishlist is"+addtowishlist);
return addtowishlist
}


async function productDelete(wishlistid, productId){

    console.log("Wishlist helper called");
   const find = await wishlistdb.findOne({_id: wishlistid , "product._id":productId })
    console.log("the product inthe cart is: " +find)
  
    const productdel =await wishlistdb.findOneAndUpdate({_id:wishlistid, product: productId },{ $pull: { product: productId}}, { new: true }).exec()
  
    return productdel
    }





module.exports={
    addToWishlist,
    productDelete
}