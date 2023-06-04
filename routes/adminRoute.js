const express = require('express')
const admin_route = express()
const adminControl = require('../Controllers/admincontrol.js')
const multer=require('multer')
const flash=require('connect-flash')
const path=require("path")
const validate=require('../Authentication/adminAuthentication')
const nocache = require('nocache');
const session = require('express-session');
const cookieparser=require('cookie-parser')
const bodyparser = require('body-parser')




admin_route.use(nocache());

admin_route.use(flash());
admin_route.use(express.json());
admin_route.use(express.urlencoded({extended:true}))

admin_route.use(bodyparser.json());
admin_route.use(bodyparser.urlencoded({extended:true}))

admin_route.use(cookieparser());

admin_route.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized:true    
    }));
    
admin_route.use((req, res, next) => {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        next();
      });




admin_route.set('view engine', 'ejs')
admin_route.set('views','./views/admin')

admin_route.use(express.static("public")) 
admin_route.use(express.static("../public/upload"))


const storage=multer.diskStorage({
    destination:(req,res,cb)=>{
    cb(null,path.join(__dirname, '../public/upload'))
},
filename:(req,file,cb)=>{
    console.log(file)
    cb(null,Date.now() + path.extname(file.originalname))
}
})
const upload = multer({ storage:storage });

//LOGIN& LOGOUT
admin_route.get('/',validate.isLogout,adminControl.login)
admin_route.get('/dashboard',validate.isLogin,adminControl.dashboard)
admin_route.post('/logout',validate.isLogin,adminControl.logout)
admin_route.route('/login').get(validate.isLogout,adminControl.login)
                           .post(adminControl.login_verify)

//PRODUCT TAB
admin_route.get('/productslist', adminControl.productslist)
admin_route.route('/addproduct').get(adminControl.addproduct)
                                .post(upload.array('image'), adminControl.addproducttodb)
                                
admin_route.route('/updateproduct').get(adminControl.updateproduct)
                                   .post(upload.array('image'),adminControl.updateproduct_todb)
admin_route.post('/deleteproduct',adminControl.deleteproduct)


//CUSTOMER TAB
admin_route.get('/customerlist', adminControl.customerlist)

admin_route.route('/updatecustomer').get(adminControl.updatecustomer)
                                    .post(adminControl.updatecustomer_todb)
admin_route.post('/deleteuser',adminControl.deleteuser)                                    

admin_route.put('/customerlist/:id/status', adminControl.customerList_Unlist)


//CATEGORIES TAB
admin_route.get('/categories',adminControl.categories)
admin_route.post('/addcategory',adminControl.addcategory)
admin_route.post('/deletecategory',adminControl.deletecategory)
admin_route.put('/categories/:id/status', adminControl.categoriesList_Unlist)






admin_route.get('/adminpage_sellers_list', adminControl.adminpage_sellers_list)
admin_route.get('/adminpage_form_productadd', adminControl.adminpage_form_productadd)


module.exports = admin_route