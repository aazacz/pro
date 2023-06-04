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
      }]
    
    });



const cart= new mongoose.model("cart",cartSchema)

module.exports=cart
