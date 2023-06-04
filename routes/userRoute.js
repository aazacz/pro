const express = require('express');
const user_route = express();
const userController = require('../Controllers/usercontrol');
const cartController = require('../Controllers/cartcontrol');
const session = require('express-session');
const nocache = require('nocache');
const flash = require('connect-flash');
const validate=require('../Authentication/userAuthentication')
const MongoStore = require('connect-mongo');

 
user_route.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://0.0.0.0:27017/kenvillSession' }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // session duration (1 day)
  })
);


user_route.use((req, res, next) => {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        next();
      });


user_route.use(express.static("public"))
user_route.set('view engine','ejs')
user_route.set('views','./views/user')
    
user_route.use(flash());
user_route.use(express.json());
user_route.use(express.urlencoded({extended:true}))




user_route.get('/',validate.isLogout,userController.index)

user_route.route('/login').get(validate.isLogout,userController.login)
                          .post(userController.login_post)
                          
user_route.route('/signup').get(userController.signup)
                           .post(userController.signup_post)

user_route.get('/logout',validate.isLogin,userController.logout)

user_route.get('/about',userController.about)
user_route.get('/contact',userController.contact)
user_route.get('/dashboard',validate.isLogin,userController.dashboard)


//      <-----------CART----------->
user_route.get('/cart',cartController.cart)
user_route.put('/cart',cartController.increaseQuantity)
user_route.put('/cartd',cartController.decreaseQuantity)
user_route.put('/cartdel',cartController.cartdel)


user_route.get('/category',userController.category)
user_route.post('/Category',cartController.addtocart) //add to cart



user_route.get('/product',userController.product)

user_route.get('/checkout',userController.checkout)
user_route.post('/checkout',cartController.checkout)
user_route.get('/success',userController.success)

//      <-----------OTP----------->
user_route.route('/otplogin').get(userController.otplogin).post(userController.otplogin_verify)    
user_route.post('/otpverify',userController.otpverify)



user_route.post('/dashboard/userupdate',userController.userupdate)
user_route.post('/dashboard/addnewadress',userController.addnewadress)











module.exports = user_route