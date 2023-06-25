const express               = require('express')
const app                   = express()
const {connectToMongoDB }   = require('./config/mongodbServer') //session in mongodb
const session               = require('express-session');
const nocache               = require('nocache');
const cors                  = require('cors')
const userRoute             = require("./routes/userRoute")
const adminRoute            = require("./routes/adminRoute")
const MongoStore            = require('connect-mongo');
const cookieparser          = require('cookie-parser')
const cacheControlMiddleware= require('./Middleware/cacheControl');

require('dotenv').config()                 //env  
const PORT                  = process.env.PORT
app.use(cors())                            //cors
connectToMongoDB()                         //mongodb server



app .set('view engine', 'ejs')              //view engine
userRoute.set('views', './views/user')      //views folder
adminRoute.set('views','./views/admin')

app.use(cookieparser());


app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.use(                                         //session
    session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: 'mongodb://0.0.0.0:27017/kenvillSession' }),
        cookie: { maxAge: 24 * 60 * 60 * 1000 }, // session duration (1 day)
    })
);


app.use(cacheControlMiddleware);        //cache Control Middleware

app.use('/', userRoute)
app.use('/admin', adminRoute)

app.listen(PORT, () => console.log('Server is running on http://localhost:6001'))