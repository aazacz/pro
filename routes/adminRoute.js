const express = require('express')
const admin_route = express()
const adminControl = require('../Controllers/admincontrol.js')
const flash=require('connect-flash')
const validate=require('../Middleware/adminAuthentication')
const {upload}=require('../Helper/imageUploader.js')
admin_route.use(flash());

admin_route.use(express.static("public"))
admin_route.use(express.static("../public/upload"))

admin_route.use(express.json());
admin_route.use(express.urlencoded({ extended: true }))
//LOG_IN & LOG_OUT
admin_route.get('/',validate.isLogout,adminControl.login)
admin_route.get('/dashboard',validate.isLogin,adminControl.dashboard)
admin_route.post('/logout',validate.isLogin,adminControl.logout)
admin_route.route('/login').get(validate.isLogout,adminControl.login)
                           .post(adminControl.login_verify)

//PRODUCT TAB
admin_route.get('/productslist',validate.isLogin, adminControl.productslist)
admin_route.route('/addproduct').get(adminControl.addproduct)
                                .post(upload.array('image'), adminControl.addproducttodb)
                                
admin_route.route('/updateproduct').get(validate.isLogin,adminControl.updateproduct)
                                   .post(upload.array('image'),adminControl.updateproduct_todb)
admin_route.post('/deleteproduct',adminControl.deleteproduct)

//CHART
admin_route.get('/chartData', adminControl.fetchChartData)
     

//CUSTOMER TAB
admin_route.get('/customerlist',validate.isLogin, adminControl.customerlist)

admin_route.route('/updatecustomer').get(validate.isLogin,adminControl.updatecustomer)
                                    .post(adminControl.updatecustomer_todb)
admin_route.post('/deleteuser',adminControl.deleteuser)                                    

admin_route.put('/customerlist/:id/status', adminControl.customerList_Unlist)


//CATEGORIES TAB
admin_route.get('/categories',validate.isLogin,adminControl.categories)
admin_route.post('/addcategory',adminControl.addcategory)
admin_route.post('/deletecategory',adminControl.deletecategory)
admin_route.put('/categories/:id/status', adminControl.categoriesList_Unlist)


//ORDER TAB
admin_route.get('/order',validate.isLogin,adminControl.order)
admin_route.post('/updateOrderStatus',adminControl.updateOrderStatus)
admin_route.get('/orderdetails',validate.isLogin,adminControl.orderdetails)

//COUPON TAB
admin_route.get('/coupons',validate.isLogin,adminControl.coupons)
admin_route.get('/addcoupon',validate.isLogin,adminControl.addcoupon)
admin_route.post('/addcoupon',adminControl.addcoupon_post)


admin_route.get('/adminpage_sellers_list',validate.isLogin, adminControl.adminpage_sellers_list)
admin_route.get('/adminpage_form_productadd',validate.isLogin, adminControl.adminpage_form_productadd)


module.exports = admin_route