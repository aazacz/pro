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
    category:{
        type: String,
        required:true, 
    },
    tax: {
        type: Number,
        required: false,
        default:18
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
    image: {
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
      },
      isDeleted: {
        type:Number,
        required:false,
        default:0
      },
      isOffer:{
        type:Boolean,
        required:false,
        default:false
      },
      offer:{
        type:Number,
        required:false,

      }
      
    });


    function arraylimit(val) {
        return val.length <= 4;
    }

const products= new mongoose.model("product",productschema)

module.exports=products
