const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
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
    }
      }],

    couponid:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "coupon",
        required: false
      }],
      couponFlag:{
        type:Number,
        required:false,
        default:0
      },
      discount:{
        type:Number,
        required:false,
        default:0
      }
    
    });



const cart= new mongoose.model("cart",cartSchema)

module.exports=cart
