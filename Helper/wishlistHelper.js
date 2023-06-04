const wishlistdb=require('../model/wishlistdb')



async function addToWishlist(userid,productid){
 
 const wishlist = await wishlistdb.findOne({ userId: req.session.userid });
 

 const addtowishlist = await wishlistdb.findByIdAndUpdate(
                                {_id:wishlist._id}, 
                                {$addToSet: { product_id: new mongoose.Types.ObjectId(productId) }},
                                { new: true, upsert: true });

return addtowishlist
}




module.exports={
    addToWishlist
}