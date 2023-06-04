const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: false
    },
    lastname: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
     block:{
        type: String,
        required:true,
        default:"active"
    },
    isAdmin:{
        type:Number,
        required:true,
        default:0
    },
    cartId:{
        type: mongoose.Schema.Types.ObjectId,
         ref: 'cart',
        required:false,
     },
    myorderId:{
        type: mongoose.Schema.Types.ObjectId,
         ref: 'cart',
        required:false,
     },
     address: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "address",
        required: false
      }]
})



const customerdetail= new mongoose.model("customerdetail",userSchema)

module.exports=customerdetail
