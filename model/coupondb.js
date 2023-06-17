const mongoose = require('mongoose')

const couponSchema =mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    discount:{
        type:Number,
        required:true
    },
    expiry:{
        type: Date, 
        default: Date.now,
         index: { expires: 0 }
    }
    
})

const coupon = new mongoose.model('coupon',couponSchema)

module.exports=coupon