const express=require("express")
const app=express()
const cartdb = require('../model/cartdb')
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


//applying coupon
exports.applyCoupon=async (req,res)=>{
    const couponDiscount = req.body.couponDiscount
    const couponId=req.body.couponId
    const session=req.session.userid
    console.log(couponDiscount,couponId);
    console.log(req.session.userid);
    const couponFind = await cartdb.findOne({couponid:new ObjectId(couponId)})
    
    if(couponFind){
        console.log("coupon IF Condition");
        const couponDiscount=0
        console.log("coupon already applied");
        console.log(couponDiscount);
        console.log(couponId);
        res.status(200).send({couponId,couponDiscount,message:"coupon already applied"})
    }
    else{
        try {
            console.log("coupon else Condition");
            const checkFlag=await cartdb.findOne({userId:session,couponFlag:0})
            console.log(checkFlag);
            if(checkFlag){
                const updateCart = await cartdb.findOneAndUpdate({ userId: session },{$addToSet: { couponid: new ObjectId(couponId) }, $set: { couponFlag: 1,discount:couponDiscount }});
                  
                console.log(updateCart);
                console.log("Coupon Applied");
                console.log(couponDiscount);
                console.log(couponId);
                res.status(200).send({couponId,couponDiscount,message:"Coupon Applied"})
            }
            else{
                res.status(200).send({couponId,couponDiscount,message:"Only One Coupon Can be Applied"})
            }
          
        } catch (error) {
            console.log(error.message);
        }
        
    }
}

//removing coupon
exports.removeCoupon=async(req,res)=>{
    try {
        const session=req.session.userid
        const discount=req.body.couponDiscount
        const checkFlag=await cartdb.findOne({userId:session,couponFlag:1})
        if (checkFlag) {
            
            const removeCoupon = await cartdb.findOneAndUpdate( { userId: session }, { $pop: { couponid: 1 }, $set: { couponFlag: 0,discount:discount } });
            console.log("removed COupon is: "+removeCoupon);          
            res.status(200).send({message:"coupon Removed"})
          }
          else[
            res.status(200).send({message:"coupon Removed"})
          ]
    } catch (error) {
        console.log(error.message);
    }
}
