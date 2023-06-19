const mongoose = require('mongoose')

const walletSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"customerdetail",
    required: false
  },
  amount: {
    type: Number,
    required: false,
    default: 0
  }

});



const wallet = new mongoose.model("wallet", walletSchema)

module.exports = wallet
