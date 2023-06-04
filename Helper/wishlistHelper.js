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




module.exports={
    addToWishlist
}