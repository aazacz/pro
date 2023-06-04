const mongoose = require('mongoose')

const addressSchema = mongoose.Schema({
   
            name: {
                type: String,
                required: false
            }, 
            houseno: {
                type: String,
                required: true
            },
            street: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true
            },
            pincode: {
                type: Number,
                required: true
            },
            phone: {
                type: Number,
                required: true
            },
            alternatenumber: {
                type: Number,
                required: false
            },
            customerid: {
                type: String,
                required: false
            }
        

})

const address = new mongoose.model("address", addressSchema)

module.exports = address
