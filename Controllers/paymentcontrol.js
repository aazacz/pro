const express=require("express")
const app=express()
const Razorpay = require('razorpay'); 
const customerdetail = require('../model/userdetailsdb')

// const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;
const orderdb = require('../model/orderdb')
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const productCopyHelper = require("../Helper/productCopyHelper")
const cors=require('cors')
app.use(cors())




exports.order = async(req,res)=>{
    try {
        console.log("1");
         console.log("post razorpay checkout")
        let cartid = req.body.cartId;
        let addressid = req.body.address;
        let grandtotal = req.body.grandPrice;
    console.log(grandtotal)
        let paymentmethod = req.body.paymentmethod;


        const amount = req.body.grandPrice * 100

        const session = req.session.userid
        console.log("session is " + session);
    
        const orderdbId = await productCopyHelper.copyProductIds(session,cartid,addressid,grandtotal,paymentmethod);
        const orderdb_Id = orderdbId._id
        console.log("the orderdb id is  " + orderdb_Id)
    
        const addUserId = await orderdb.findByIdAndUpdate(orderdb_Id, { userId: req.session.userid })
        console.log("new userid added to orderdb");
    
        const addtouser = await customerdetail.findByIdAndUpdate(req.session.userid, { myorderId: orderdb_Id },{ new: true });
        console.log("new orderId added to customerDB");
    
        console.log("oreder is:  "+orderdb_Id);

        const razorpay = new Razorpay({
            key_id: 'rzp_test_c9kyL8vciS4dlx',
            key_secret: 'ZFAMnrYKNJZeo1SrjKKS6Ahw'
            
         });
        console.log("2");
      
let  order  
        try {
            order = await razorpay.orders.create({
                amount: amount,
                currency: 'INR',
                receipt: 'ReceiptNo'
            });
            console.log('Order created:', order);
            res.status(201).json({ success: true, order, amount ,orderdb_Id});
        } catch (error) {
            console.log('Error creating order:', error);
        }

    } catch (error) {
        console.log(error.message);
    }
}

