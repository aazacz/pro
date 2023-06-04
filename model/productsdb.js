const mongoose = require('mongoose')

const productschema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    category_id:{
        type: mongoose.Schema.Types.ObjectId,
         ref: 'category',
         required:true, 
    },
    tax: {
        type: String,
        required: true
      },
    quantity: {
        type: Number,
        required: true
      },
    purchased:{
    type:Number,
    required:false
      },
      
    isCreated: {
        type: Date,
        required: true
      },
    image:{
        type: Array,
        required: true,
        validate:[arraylimit,"maximun 3 product image"]
     },
     description: {
        type: String,
        required: true
      } ,
       isselected:{
        type: Number,
        default:0
    }
    
    });


    function arraylimit(val) {
        return val.length <= 4;
    }

const products= new mongoose.model("product",productschema)

module.exports=products
