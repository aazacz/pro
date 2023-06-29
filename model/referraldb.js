const mongoose = require('mongoose')

const referralSchema=  mongoose.Schema({

code:{
    type:String,
    required:false
},
UserId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"customerdetail",
    required:false
}
})


const referral = new mongoose.model("referral",referralSchema)

module.exports=referral