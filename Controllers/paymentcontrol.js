const express=require("express")
const app=express()

const orderdb = require('../model/orderdb')
const customerdetail = require('../model/userdetailsdb')
const productCopyHelper = require("../Helper/productCopyHelper")

const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;
const Razorpay = require('razorpay'); 


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
    
        const {orderdbId,productids} = await productCopyHelper.copyProductIds(session, cartid, addressid, grandtotal, paymentmethod);
        const orderdb_Id = orderdbId._id
        console.log("the orderdb id is  " + orderdb_Id)
        const productIds = productids
        console.log(productIds);
    
        const addUserId = await orderdb.findByIdAndUpdate(orderdb_Id, { $set: { userId: req.session.userid, payment: "Paid" } })
        console.log("new userid added to orderdb   &   user paid the Amount");
  
    
        const addtouser = await customerdetail.findByIdAndUpdate(req.session.userid, { myorderId: orderdb_Id },{ new: true });
        console.log("new orderId added to customerDB");
    
        console.log("oreder is:  "+orderdb_Id);

        const razorpay = new Razorpay({ key_id: RAZORPAY_ID_KEY, key_secret: RAZORPAY_SECRET_KEY });
       
        let  order;
        try {

            order = await razorpay.orders.create({
                amount: amount,
                currency: 'INR',
                receipt: 'ReceiptNo'
            });

            console.log('Order created:', order);
            res.status(201).json({ success: true, order, amount ,orderdb_Id,cartid,productIds:productIds});
            
        } catch (error) {
            console.log('Error creating order:', error);
        }

    } catch (error) {
        console.log(error.message);
    }
}

