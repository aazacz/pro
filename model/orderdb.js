const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
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
    }
    
    });



const order= new mongoose.model("order",orderSchema)

module.exports=order
