const bcrypt = require('bcrypt')
const wishlistdb = require('../model/wishlistdb')
const Otp = require('../model/otpdb')
const otpGenerator = require('otp-generator')
const nodemailer = require('nodemailer')
const categorydb = require("../model/categorydb")
const productdb = require('../model/productsdb')
const cartdb = require('../model/cartdb')
const customerdetail = require('../model/userdetailsdb')
const addressdb = require('../model/addressdb')
const orderdb = require('../model/orderdb')
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const letterCaseChanger = require('../Helper/letterCaseChangerHelper')
const coupondb = require('../model/coupondb')
const walletdb = require('../model/walletdb')

//password Hashing
const passwordHash = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 5)
        return passwordHash;
    } catch (error) {
        console.log(error.message)
    }
}



//index page
exports.index = async (req, res) => {
    let session = req.session.userid
    if (session) {
        console.log(""); const miniCart = await cartdb.findOne({ userId: req.session.userid }).populate('product').exec()

        res.render('index', { session: session, miniCart: miniCart })
    }
    else {
        const session = null
        const miniCart = null
        res.render('index', { session: session, miniCart: miniCart })
    }

}



//login page
exports.login = (req, res) => {
    const session = null
    const title = req.flash("title");
    let miniCart;
    res.render('login', { title: title[0] || "", session: session, miniCart })
}
//POST login page
exports.login_post = async (req, res) => {
    try {

        console.log(req.body.email)  //email printing

        const userlog = await customerdetail.findOne({ email: req.body.email }).populate("cartId")

        // console.log(userlog)
        console.log(req.body.password);  //password printing
        if (userlog) {
            console.log(userlog);

            const passwordmatch = await bcrypt.compare(req.body.password, userlog.password)

            if (passwordmatch) {

                req.session.userid = userlog._id
                console.log("session");
                console.log(req.session.userid);
                res.redirect('/')
            }
            else {
                req.flash("title", "password incorrect");
                console.log("password incorrect");
                res.redirect('/login')
            }
        }
        else {
            req.flash("title", "Username incorrect");
            console.log("username incorrect");
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error.message);
    }


}







//UserLogout
exports.logout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/')
    } catch (error) {
        console.log(error.message);
    }
}




//about page
exports.about = (req, res) => {
    res.render('about')
}

//contact page
exports.contact = (req, res) => {
    res.render('contact')
}
//dashboard page
exports.dashboard = async (req, res) => {

    try {

        let session = req.session.userid
        console.log("session id in the dashboard page is: " + session);

        let cart = await cartdb.findOne({ userId: req.session.userid }).populate('product.product_id').exec()

        let user = await customerdetail.findOne({ _id: new ObjectId(req.session.userid) }).populate('address').populate('walletId').exec()
        // console.log(user);

        const miniCart = await cartdb.findOne({ userId: req.session.userid }).populate('product.product_id').exec()

        const wishlist = await wishlistdb.findOne({ userId: req.session.userid }).populate('product').exec()

        const orderlist = await orderdb.find({userId: req.session.userid})
        
        
        console.log("orderlist is"+orderlist);


       
        if (req.session.userid) {
            const session = req.session.userid
            res.render('dashboard', {
                session: session,
                cart: cart,
                user: user,
                miniCart: miniCart,
                wishlist: wishlist,
                orderlist:orderlist
            })
        }
        else {
            const session = null
            const miniCart = null
            res.render('dashboard', { session: session,miniCart:miniCart })
        }

    } catch (error) {
        console.log(error);
    }

}

//post - dashboard userdetails update
exports.userupdate = async (req, res) => {

    try {

        let addressname = letterCaseChanger.toTitleCase(req.body.addressname)
        let houseNo = letterCaseChanger.toTitleCase(req.body.houseNo)
        let street = letterCaseChanger.toTitleCase(req.body.street)
        let state = letterCaseChanger.toTitleCase(req.body.state)
        let pincode = req.body.pincode
      
        let phone = req.body.phone
        let userid = req.session.userid
        let addressid=req.body.addressid

        //checking if the address already exists
        const addressExists = await addressdb.findOne({
            _id:addressid,
            name: addressname,
            houseno: houseNo,
            street: street,
            state: state,
            pincode: pincode,
            phone: phone,
            customerid: userid,
           
        })

        console.log(addressExists);


        if (addressExists) {//checking if the same address exists
            return;

        }
        else {
          
            //update the existing address
            const updateAddress = await addressdb.findByIdAndUpdate(addressid, { $set: {   name: addressname,
                                                                                                houseno: houseNo,
                                                                                                street: street,
                                                                                                state: state,
                                                                                                pincode: pincode,
                                                                                                phone: phone,
                                                                                               
                                                                                                customerid: userid,
                                                                                                addressid:addressid } }, 
                                                                                { new: true })

           
            console.log(updateAddress);

            res.send({ message: "user details updated" })
        }
    } catch (error) {
        console.log(error.message);
    }
}



//post - add address 
exports.addnewadress = async (req, res) => {

    let addressname =letterCaseChanger.toTitleCase(req.body.addressname) //called Helper function
    let houseNo = letterCaseChanger.toTitleCase(req.body.houseNo)
    let street = letterCaseChanger.toTitleCase(req.body.street)
    let state = letterCaseChanger.toTitleCase(req.body.state)
    let pincode = req.body.pincode
    let alternatePhone = req.body.alternatePhone
    let phone = req.body.phone
    let userid = req.session.userid
    console.log(userid)
    console.log(addressname)
    console.log(houseNo)
    console.log(street)
    console.log(state)
    console.log(pincode)
    console.log(alternatePhone)
    console.log(phone)

    //checking if the address already exists
    const addressExists = await addressdb.findOne({
        name: addressname,
        houseno: houseNo,
        street: street,
        state: state,
        pincode: pincode,
        phone: phone,
       
        customerid: userid
    })

    console.log(addressExists);


    if (addressExists) {//checking if the same address exists
        console.log("Address already exists");
        return;

    }
    else {
        const updateaddress = new addressdb({
            name: addressname,
            houseno: houseNo,
            street: street,
            state: state,
            pincode: pincode,
            phone: phone,
           
            customerid: userid
        })

        const updateAddress = await updateaddress.save()
        const addrerssId = new ObjectId(updateAddress._id);
        console.log(addrerssId);
        const addtoUserDb = await customerdetail.findByIdAndUpdate(userid, { $addToSet: { address: addrerssId } }, { new: true })
        res.send({ messsage: "address added" })
    }
}

exports.editaddress=async(req,res)=>{
    try {
        
    
    let addressname =letterCaseChanger.toTitleCase(req.body.name) //called Helper function
    let houseNo = letterCaseChanger.toTitleCase(req.body.houseNo)
    let street = letterCaseChanger.toTitleCase(req.body.street)
    let state = letterCaseChanger.toTitleCase(req.body.state)
    let pincode = req.body.pincode
    
    let phone = req.body.phone
    let userid = req.session.userid
    let addressid=req.body.addressid


    const updateAddress = await addressdb.findByIdAndUpdate(addressid, { $set: {   name: addressname,
                                                                                        houseno: houseNo,
                                                                                        street: street,
                                                                                        state: state,
                                                                                        pincode: pincode,
                                                                                        phone: phone,
                                                                                        customerid: userid,
                                                                                        addressid:addressid } }, 
                                                                                { new: true,upsert:true })


    console.log(updateAddress);
    res.redirect('/dashboard')
} catch (error) {
   console.log(error.message);     
}

}





//product open page
exports.product = async (req, res) => {
   
   try {
    
   
    const session = req.session.userid
    console.log(session);
    console.log(req.query.productid)
    if(session){
        const product = await productdb.findOne({ _id: req.query.productid })
        const category = await categorydb.find({})

        const miniCart = await cartdb.findOne({ userId: req.session.userid }).populate('product.product_id').exec()
        res.render('product', { product: product, session: session, miniCart: miniCart,category:category })
    }
    else{
        const product = await productdb.findOne({ _id: req.query.productid })
        const category = await categorydb.find({})
        const miniCart = null
        res.render('product', { product: product, session: session, miniCart: miniCart,category:category })
    }
   
} catch (error) {
    console.log(error.message);
}
}

//category page
exports.category = async (req, res) => {
    try {
        const pageNum=req.query.page
        const perpage = 2
        let doCount;

        const selectedCategories = req.body.categories || [];
        

        const session = req.session.userid
        console.log("checking session exists before loading category page");
        console.log(session);

        const product = await productdb.find({}).countDocuments().then(documents=>{
            doCount=documents
            return productdb.find({}).skip(((pageNum-1)*perpage)).limit(perpage)
        })

        // console.log(product);
        const title = req.flash("title");


        let user = await customerdetail.findOne({ _id: req.session.userid }).populate('address').populate('cartId')

        const miniCart = await cartdb.findOne({_id: req.session.userid}).populate('product.product_id').exec()
       
        const category = await categorydb.find({})
        
        if(miniCart||session){

            res.render("category", { title: title[0] || "",
                                    currentPage:pageNum,
                                    totalDocument:doCount, 
                                    pages:Math.ceil(doCount/perpage),
                                    product: product, 
                                    session: session, 
                                    user: user,
                                    miniCart: miniCart,
                                    category:category })

        }
        else{
            

            const product = await productdb
              .find({})
              .countDocuments()
              .then((documents) => {
                doCount = documents;
                return productdb
                  .find({})
                  .skip((pageNum - 1) * perpage)
                  .limit(perpage);
              });
            
            const session=null
            const miniCart=undefined
            res.render('category',{session: session,
                                   miniCart: miniCart,
                                   product: product,
                                   currentPage:pageNum,
                                   totalDocument:doCount, 
                                   pages:Math.ceil(doCount/perpage),
                                   category:category })
        }



       
    } catch (error) {
        console.log(error.message)
    }

}

exports.search=async (req, res) => {
    try {
      const productName = req.body.pname;
      const productData = await productdb.find({ name: { $regex: productName, $options: 'i' } });
  
      res.json(productData);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };





//signup page rendering
exports.signup = (req, res) => {
    const session = null
    const title = req.flash("title");
    let miniCart;
    res.render('signup', { title: title[0] || "", session: session, miniCart: miniCart })
}


//POST signup page rendering
exports.signup_post = async (req, res) => {
    try {
        const { email, password, repassword } = req.body;
        const finduser = await customerdetail.findOne({ email: email })

        let newCustomer
        let newaddress

        if (finduser) { //IF case -- checking if user already registered
            console.log("User Already Registered")
            req.flash("title", "User Already Registered");
            res.redirect("/signup")
        }
        else {                  //Else case if User is NEW

            if (password === repassword) {//check if paswwords match 
                const passwordH = await passwordHash(req.body.password);

                newCustomer = new customerdetail({
                    firstname:" ",
                    lastname:" ",
                    name: req.body.username,
                    email: req.body.email,
                    password: passwordH,
                    block: "active",
                    isAdmin: 0

                });

                try {
                    console.log(newCustomer);
                    await newCustomer.validate(); // Validate the newCustomer document
                    const insertdata = await newCustomer.save();


                    //creating a new address DATABASE for the user   &&    Inserting the addressDB id in to the customer DB
                    const newaddress = new addressdb({
                        name: insertdata.name,
                        houseno: " ",
                        street: " ",
                        state: " ",
                        pincode: " ",
                        phone: " ",
                        alternatenumber: " ",
                        customerid: new ObjectId(insertdata._id)
                    })

                    const insertedAddress = await newaddress.save();
                    await customerdetail.findByIdAndUpdate(insertdata._id, { address: [new ObjectId(insertedAddress._id)] })


                    //creating a new cart DATABASE for the user   &&   inserting the cartDB_id in to the customer DB
                    const addtocart = new cartdb({ userId: insertdata._id, product: [],couponid:[],couponFlag:0 });
                    const cart = await addtocart.save()
                    await customerdetail.findByIdAndUpdate(insertdata._id, { cartId: [new ObjectId(cart._id)] })


                    //creating a new wallet for the new user & adding the wallet id to the customer details
                    const wallet = new walletdb({
                        userId:insertdata._id,
                        amount:0
                    }) 
                    const walletCreate = await wallet.save()  //wallet is also created
                    await customerdetail.findByIdAndUpdate(insertdata._id, { walletId: [new ObjectId(walletCreate._id)] })


                    //creating a new wishlist Db for the user && inserting the cartDB_id in to the customer DB
                    const newWishListDb = new wishlistdb({ userId: insertdata._id, product: [] })
                    const newWishlist = await newWishListDb.save()
                    await customerdetail.findByIdAndUpdate(insertdata._id, { wishlistId: [new ObjectId(newWishlist._id)] })


                    if (insertdata) {
                        req.flash("title", "Successfully registered");
                        res.redirect('/login')
                    } else {
                        req.flash("title", "Registration Error");
                        res.redirect('/signup')
                    }
                } catch (error) {
                    console.log(error.message);
                }


            } else {
                req.flash("title", "Password didn't match");
                res.redirect('/signup')

            }

        }


    } catch (error) {
        console.log("error in catch");
        console.log(error.message);
    }
};


//otp login ---1st step
exports.otplogin = async (req, res) => {
    try {
        const session = null
        const title = req.flash("title");
        const miniCart = await cartdb.findOne({ userId: req.session.userid }).populate('product.product_id').exec()
        res.render("otplogin", { title: title[0] || "", session: session, miniCart: miniCart })

    } catch (error) {
        console.log(error.message)

    }
}


//otp signup  ----1st step
exports.otpsignup = async (req, res) => {
    try {
        const session = null
        const title = req.flash("title");
        const miniCart = null
        res.render("otpsignup", { title: title[0] || "", session: session, miniCart: miniCart })

    } catch (error) {
        console.log(error.message)

    }
}






//POST otp signup   =-----  2nd step
exports.otpsignup_verify = async (req, res) => {
    try {
        // const userData = await customerdetail.findOne({ email: req.body.email });


        // if (userData) {
            // if (userData.block == "active") {

                const OTP = otpGenerator.generate(4, {
                    digits: true,
                    alphabets: false,
                    upperCaseAlphabets: false,
                    lowerCaseAlphabets: false,
                    specialChars: false,
                });
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: "abhilashabinz@gmail.com",
                        pass: "otjhcsnvnhknygrh",
                    },
                });


                var mailOptions = {
                    from: "abhilashabinz@gmail.com",
                    to: req.body.email,
                    subject: "OTP VERIFICATION",
                    text: "PLEASE ENTER THE OTP FOR LOGIN " + OTP,
                };
                transporter.sendMail(mailOptions, function (error, info) { });
                console.log(OTP);

                const otp = new Otp({ email: req.body.email, otp: OTP });
                const salt = await bcrypt.genSalt(10);
                otp.otp = await bcrypt.hash(otp.otp, salt);
                const result = await otp.save();
               

                const session = null
                const minicart = null
                res.render("otpsignupverify", { data: result, session: session,miniCart:minicart });
           
        
    } catch (error) {
        console.log(error.message);
    }
}



// POST otp signup verify ---3rd step
exports.signup_verify = async (req, res) => {
    try {
        
        console.log(req.body.otp)
        const userdata = await Otp.findOne({ email: req.body.email })
        console.log(userdata)
        if (userdata) {
            const otpmatch = await bcrypt.compare(req.body.otp, userdata.otp)
            console.log(otpmatch);
            if (otpmatch) {

                newCustomer = new customerdetail({
                     name: "User",
                    email: req.body.email,
                    block: "active",
                    isAdmin: 0

                });

                try {
                    console.log(newCustomer);
                    await newCustomer.validate(); // Validate the newCustomer document
                    const insertdata = await newCustomer.save();


                    //creating a new address DATABASE for the user   &&    Inserting the addressDB id in to the customer DB
                    const newaddress = new addressdb({
                        name: insertdata.name,
                        houseno: " ",
                        street: " ",
                        state: " ",
                        pincode: " ",
                        phone: " ",
                        alternatenumber: " ",
                        customerid: new ObjectId(insertdata._id)
                    })

                    const insertedAddress = await newaddress.save();
                    await customerdetail.findByIdAndUpdate(insertdata._id, { address: [new ObjectId(insertedAddress._id)] })


                    //creating a new cart DATABASE for the user   &&   inserting the cartDB_id in to the customer DB
                    const addtocart = new cartdb({ userId: insertdata._id, product: [],couponid:[],couponFlag:0 });
                    const cart = await addtocart.save()
                    await customerdetail.findByIdAndUpdate(insertdata._id, { cartId: [new ObjectId(cart._id)] })

                    //creating a new wishlist Db for the user && inserting the cartDB_id in to the customer DB
                    const newWishListDb = new wishlistdb({ userId: insertdata._id, product: [] })
                    const newWishlist = await newWishListDb.save()
                    await customerdetail.findByIdAndUpdate(insertdata._id, { wishlistId: [new ObjectId(newWishlist._id)] })



                req.session.userid = insertdata._id
                const session=req.session.userid;
                const miniCart = await cartdb.findOne({ userId: req.session.userid }).populate('product.product_id').exec()

                res.render('index',{miniCart:miniCart,session:session})
                }
                catch(error){
                    console.log(error.message);
                }
            } else {
                req.flash("title", "OTP is not matched");
                console.log("otp wrong");
                res.redirect('/otplogin')
            }

        } else {
            req.flash("title", "OTP expired");

            console.log("otp expired");
            res.redirect('/otplogin')
        }

    } catch (error) {
        console.log(error.message);
    }
}







//POST otp login
exports.otplogin_verify = async (req, res) => {
    try {
        const userData = await customerdetail.findOne({ email: req.body.email });


        if (userData) {
            if (userData.block == "active") {
                const OTP = otpGenerator.generate(4, {
                    digits: true,
                    alphabets: false,
                    upperCaseAlphabets: false,
                    lowerCaseAlphabets: false,
                    specialChars: false,
                });
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: "abhilashabinz@gmail.com",
                        pass: "otjhcsnvnhknygrh",
                    },
                });
                var mailOptions = {
                    from: "abhilashabinz@gmail.com",
                    to: userData.email,
                    subject: "OTP VERIFICATION",
                    text: "PLEASE ENTER THE OTP FOR LOGIN " + OTP,
                };
                transporter.sendMail(mailOptions, function (error, info) { });
                console.log(OTP);

                const otp = new Otp({ email: req.body.email, otp: OTP });
                const salt = await bcrypt.genSalt(10);
                otp.otp = await bcrypt.hash(otp.otp, salt);
                const result = await otp.save();
               

                const session = null
                const minicart = null
                res.render("otpverify", { data: result, session: session,miniCart:minicart });
            } else {
                req.flash("title", "User is Blocked");
                res.redirect("/otplogin");
            }
        } else {
            req.flash("title", "User is not found");
            res.redirect("/otplogin");
        }
    } catch (error) {
        console.log(error.message);
    }
}


// POST otp verify
exports.otpverify = async (req, res) => {
    try {
        console.log(req.body.email)
        console.log(req.body.otp)
        const userdata = await Otp.findOne({ email: req.body.email })
        console.log(userdata)
        if (userdata) {
            const otpmatch = await bcrypt.compare(req.body.otp, userdata.otp)
            console.log(otpmatch);
            if (otpmatch) {
                req.session.userid = userdata._id
                const session=req.session.userid;
                const miniCart = await cartdb.findOne({ userId: req.session.userid }).populate('product.product_id').exec()

                res.redirect('/',{miniCart:miniCart,session:session})
            } else {
                req.flash("title", "OTP is not matched");
                console.log("otp wrong");
                res.redirect('/otplogin')
            }

        } else {
            req.flash("title", "OTP expired");

            console.log("otp expired");
            res.redirect('/otplogin')
        }

    } catch (error) {
        console.log(error.message);
    }
}

//checkout page
exports.checkout = async (req, res) => {
try {
    

    if (req.session.userid) {
        const cart = await cartdb.findOne({userId: req.session.userid}).populate('product.product_id').exec()
          
        let user = await customerdetail.findOne({ _id: req.session.userid }).populate('address').exec()

        const session = req.session.userid
        const miniCart = await cartdb.findOne({ userId: req.session.userid }).populate('product.product_id').exec()
        const couponlist = await coupondb.find({})
        console.log(couponlist);
        
        res.render('checkout', { session: session, user: user, cart: cart, miniCart: miniCart,couponlist:couponlist })
    }
    else {
        const session = null
        res.render('checkout', { session: session })
    }
} catch (error) {
    
}


}



//GET success page
exports.success = async (req, res) => {
    try {
    
        const session = req.session.userid
        
        const cartid  = req.query.cartid
        const orderid = req.query.orderid
        const productIds = req.query.productIds
        console.log("orderid from the query is "+orderid);
        console.log("cartid from the query is "+cartid);
        console.log("productIds from the query is "+productIds);

        const discount=0

        const checkFlag=await cartdb.findOne({userId:session,couponFlag:1})
        if (checkFlag) { //checking if any coupon used and 
            const removeCoupon = await cartdb.findOneAndUpdate( { userId: session }, {$set: { couponFlag: 0,discount:discount } });
            console.log("removed COupon is: "+removeCoupon);       
        }
       
            const updatepayment= await orderdb.findByIdAndUpdate(orderid,{$set:{payment:"Paid"}}).exec()
            // console.log("amount paid: "+updatepayment)
    
            const order= await orderdb.findOne({_id:orderid}).populate('address').exec()
            console.log("populated order is"+order)
           

            if(order){
    
            const user = await customerdetail.find({ _id: req.session.userid }).populate('address')

            //empty the cart
             const cartEmpty = await cartdb.findByIdAndUpdate(cartid, {$set: { product: [] } });

            const miniCart=undefined
            res.render('success', { session: session, user: user,miniCart: miniCart,order:order })
        }else{
            
            const miniCart=undefined
            res.render('404',{miniCart:miniCart})
        }

       
     
    } catch (error) {
        console.log(error.message);
    }


}













