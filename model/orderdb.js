const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    userId: {
       type: mongoose.Schema.Types.ObjectId,
        ref: "customerdetail",
        required: false
    },
    product: [{
        product_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: false
    },
    quantity:{
        type:Number,
        required:false,
        default:1
    },
    
      }],
      grandtotal:{
        type:Number,
        required:true,

    },
    paymentmethod:{
        type:String,
        required:true
    },
    address:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "address",
        required: false
    },
    purchased:{
        type: Date,
        default: Date.now,
    
    },
    status:{
        type: String,
        default: "Pending",
    
    }
    
    });



const order= new mongoose.model("order",orderSchema)

module.exports=order
