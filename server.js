
const express = require('express')
const app = express()
const mongoose = require('mongoose')
mongoose.connect("mongodb://0.0.0.0:27017/kenvilldb")
        .then(() =>console.log("Database Connected"))
        .catch(() => console.log("Database Disconnected"))

const PORT = process.env.PORT || 3000



const userRoute = require("./routes/userRoute")
const adminRoute = require("./routes/adminRoute")


app.use('/', userRoute)
app.use('/admin', adminRoute)









app.listen(PORT, () => console.log('Server is running on http://localhost:3000'))