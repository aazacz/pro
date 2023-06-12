const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    userId: {
       type: mongoose.Schema.Types.ObjectId,
        ref: "customerdetail",
        required: false
    },
    orderProducts: [{
       
    name:{
        type:String,
        required:false,
    },
    quantity:{
        type:Number,
        required:false,
        default:1
    },
    price:{
        type:Number,
        required:false,
        default:1
    
      },
      image: {
        type: Array,
        required: true,
        
     }
    } ],

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
    
    },
    payment:{
        type: String,
        default: "Unpaid",
    
    },
    
    });



const order= new mongoose.model("order",orderSchema)

module.exports=order
