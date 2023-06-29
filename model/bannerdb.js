const mongoose = require('mongoose')

const bannerSchema = mongoose.Schema({
    image1: {
        type: String,
        required: false
    },
    image2: {
        type: String,
        required: false
    },
    image3: {
        type: String,
        required: false
    },
    image4: {   
        type: String,
        required: false
    },

})

const banner= new mongoose.model("banner",bannerSchema)
module.exports=banner