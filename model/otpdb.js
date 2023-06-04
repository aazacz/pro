const mongoose = require('mongoose')

const otpschema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    index: { expires: 300 }
    }
   
})

const otp= new mongoose.model("otp",otpschema)

module.exports=otp
