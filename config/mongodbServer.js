const mongoose = require('mongoose');
require('dotenv').config()  //env
const {mongooseId} = process.env;


const connectToMongoDB = async () => {
  try {
    await mongoose.connect(mongooseId);
    console.log("Database Connected");
  } catch (error) {
    console.log("Database Disconnected");
  }
};

module.exports = { connectToMongoDB };
