const wishlistdb = require('../model/wishlistdb')
const wishlistHelper = require("../Helper/wishlistHelper")
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;


exports.addtowishlist = async (req, res) => {

    const userid = req.body.userid
    const productid = req.body._id

    console.log("session in the page is: " + req.session.userid);
    //checking if wishlist already exists
    let wishlist = await wishlistdb.findOne({ userId: req.session.userid })
    try {
        if (wishlist) {
            const isProductExist = await wishlistdb.findOne({ userId: req.session.userid, product: new ObjectId(productid) });
            console.log("PRODUCT FOUND IS:  " + isProductExist);

            if (!isProductExist) { //Executes the IF Condition if the product is not already existed in the cart
                console.log("product does not exist in the cart");

                const userId = userid
                const productId = productid

                // Wishlist Helper function
                const WishlistHelper = await wishlistHelper.addToWishlist(userId, productId)

                if (WishlistHelper) {
                    res.send({ message: 'Added To Wishlist' })
                    return
                }
                else {
                    res.send({ message: 'Already Exists' })
                    return
                }


            }
            else {
                res.send({ message: "Already Exists" })
                return;
            }

        }
        else {  //else condition only works if wishlistDB is not already created in the beginning of the signup

            const newWishListyDb = new wishlistdb({
                userid: userid,
                product: []
            })

            await newWishListyDb.save()

            const userid = req.session.userid
            const productId = productid

            // Wishlist Helper function
            const WishlistHelper = await wishlistHelper.addToWishlist(userid, productId)

            if (wishlistHelper) {
                res.send({ message: 'Added To Wishlist' })
            }
            else {
                res.send({ message: 'Already Exists' })
            }


            return
        }

    } catch (error) {
        console.log(error.message);
    }



}



exports.deleteFromWishlist = async (req, res) => {
    try {
        const productId = new ObjectId(req.body.id);
        const wishlistid = req.body.cartid
        console.log("the product Id is: " + productId + "\n wishlist ID is :" + wishlistid)

        // calling wishlist Helper
        const productdel = await wishlistHelper.productDelete(wishlistid, productId)

        if (productdel) {
            res.send({ message: "deleted" })
        }
        else {
            res.send({ message: "not deleted" })
        }

    } catch (error) {
        console.log(error.message);
    }
}