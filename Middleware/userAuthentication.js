const cartdb    = require('../model/cartdb')
const bannerdb  = require('../model/bannerdb')


const isLogin = async (req, res, next) => {
    try {
        if (req.session.userid) {
            next();
        } else {
            res.redirect('/login');
        }
       
    }
    catch (error) {
        console.log(error.message);
    }
}



const Logout = async (req, res, next) => {
    try {
        if ( req.session.userid) {
            const session=req.session.userid
            // console.log(session);
            if (session) {
             console.log(" session exists: "+session);
            
             const miniCart= await cartdb.findOne({userId:req.session.userid}).populate('product.product_id').exec()
             console.log(miniCart)
             
             res.render('index', { session: session,miniCart:miniCart })
            }
        } else {
            next()
        }
        
    }
    catch (error) {
        console.log(error.message);
    }
}
const isLogout = async (req, res, next) => {
    try {
        if ( req.session.userid) {
            const session=req.session.userid
            // console.log(session);
            if (session) {
             console.log(" session exists: "+session);
             let banners = await bannerdb.findOne({})
             
             const miniCart= await cartdb.findOne({userId:req.session.userid}).populate('product.product_id').exec()
             console.log(miniCart)
             res.render('index', { session: session,miniCart:miniCart,banners:banners })
            }
        } else {
            next()
        }
        
    }
    catch (error) {
        console.log(error.message);
    }
}

module.exports = { isLogin, isLogout,Logout }