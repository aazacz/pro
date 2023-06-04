const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    userId: {
        type: String,
        required: false
    },
    product: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: false
      }],
    quantity:{
        type: Number,
        required:false      
    }
    
    });



const order= new mongoose.model("order",orderSchema)

module.exports=order
