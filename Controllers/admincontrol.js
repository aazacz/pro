
const customerdetail = require("../model/userdetailsdb")
const bcrypt = require('bcrypt')
const categorydb = require("../model/categorydb")
const productdb = require('../model/productsdb')
const orderdb = require('../model/orderdb')
const coupondb = require('../model/coupondb')
const letterCaseChangerHelper = require('../Helper/letterCaseChangerHelper')
const walletdb = require('../model/walletdb')
const bannerdb = require('../model/bannerdb')
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;


//                            <--------------------------ADMIN LOGIN AND VALIDATIONS------------------------------->


//GET - login page
exports.login = (req, res) => {
    res.render('login')
}



//POST - login page
exports.login_verify = async (req, res) => {
    try {
        const userlog = await customerdetail.findOne({ email: req.body.email })

        if (userlog) {

            const passwordmatch = await bcrypt.compare(req.body.password, userlog.password)

            if (passwordmatch) {
                if (userlog.isAdmin == 1) {
                    req.session.admin_id = userlog._id
                    req.session.save()
                    res.redirect('/admin/dashboard')
                }
                else {
                    res.redirect('/admin/login')
                    console.log("adminis unauthorised");
                }
            }
            else {
                console.log("password incorrect");
            }
        }
        else {
            console.log("username incorrect");
            res.redirect('/admin/login')
        }
    } catch (error) {
        console.log(error.message);
    }
}


//Dashboard
exports.dashboard =async (req, res) => {
    const order= await orderdb.find({}).populate('userId')
    const delivered= await orderdb.find({status:"Delivered"}).populate('userId')
    console.log(delivered); 

    const salesData = await orderdb.aggregate([
        { $match: { status: 'Delivered' } },  { $group: { _id: { $dateToString: { format: '%Y-%m-%d',date: { $toDate: '$purchased' } }},totalRevenue: { $sum: '$grandtotal' } }},{$sort: { _id: -1 }},{$project: { _id: 0, date: '$_id',totalRevenue: 1}}]);

        const numberOfProducts= await productdb.find({}).count()
        // console.log(numberOfProducts);
        const totalSum  = salesData.reduce((sum, entry) => sum + entry.totalRevenue, 0);
        const count     = salesData.reduce((sum, entry) => sum + 1, 0);

     /*    const year=await orderdb.aggregate([
            {
              $match: {
                $expr: {
                  $eq: [{ $year: "$purchased" }, [2023,2024,2025]]
                }
              }
            }
          ]) */
console.log("ppppppppppppppppppppppppppppp");
         /*  console.log(year); */
        // console.log(count)
        // console.log(totalSum)
        // console.log(order)
        // console.log(salesData)
if(order){
    res.render('dashboard',{order:order,totalSum:totalSum,count:count,numberOfProducts:numberOfProducts,delivered:delivered})
}else{
    const order=null
    const totalSum=null
    const count=null
    res.render('dashboard',{order:order})
}
    
}

//Admin Logout
exports.logout = async (req, res) => {  
    try {
        req.session.destroy();
        res.redirect('/admin/')
    } catch (error) {
        console.log(error.message);
    }
}


//                            <--------------------------CUSTOMER LISTING TAB------------------------------->




//GET-  Customer list 
exports.customerlist = async (req, res) => {
    try {
        // .populate("category_id")
        const customer = await customerdetail.find({})
        // console.log(customer);
        res.render('customerlist', { customer: customer })

    } catch (error) {
        console.log(error.message);
    }
}

// GET- Updating Customer list 
exports.updatecustomer = async (req, res) => {
    try {
        console.log("req.params.updateid");
        console.log(req.query.updateid);
        const customer = await customerdetail.findOne({ _id: req.query.updateid })
        console.log(customer);
        res.render('updatecustomer', { customer: customer })

    } catch (error) {
        console.log(error.message);
    }
}

// POST- Updating Customer list 
exports.updatecustomer_todb = async (req, res) => {
    try {
        console.log("req.params.updateid");
        console.log(req.body.id);

        const updatedata = {
            name: req.body.name,
            email: req.body.email
        }

        const customerdata = await customerdetail.updateOne({ _id: req.body.id }, { $set: updatedata })
        console.log(customerdata);
        res.redirect('/admin/customerlist')

    } catch (error) {
        console.log(error.message);
    }
}

//POST- DeleteUser
exports.deleteuser = async (req, res) => {
    try {
        console.log(req.body.id)
        const deleteid = req.body.id
        const userid = await customerdetail.deleteOne({ _id: deleteid })
        res.redirect('/admin/customerlist')
    } catch (error) {
        console.log(error.message);
    }
}

//PUT - Customer Listing or Unlisting
exports.customerList_Unlist = async (req, res) => {
    const documentId = req.params.id;
    console.log(documentId)
    const newStatus = req.body.status; ``
    console.log(newStatus)

    try {
        // Update the document's status in the database
        const done = await customerdetail.findByIdAndUpdate(documentId, { block: newStatus });
        res.status(200).json({ message: 'Status updated successfully' })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating status' })
    }
}

//                            <--------------------------PRODUCT LISTING TAB ------------------------------->



//GET- Product List
exports.productslist = async (req, res) => {
    try {
        const productlist = await productdb.find({})
        // console.log(productlist);
        res.render('productslist', { productlist: productlist })

    } catch (error) {
        console.log(error.message);
    }
}

//GET  -  Add Product Page
exports.addproduct = async (req, res) => {
    try {
        const category = await categorydb.find({})
        // console.log(category);

        res.render('addproduct', { category: category })
    } catch (error) {
        console.log(error.message);
    }

}

//For Deleting the product
exports.deleteproduct = async (req, res) => {
    try {
       
        const deleteid = req.body.id
        const userid = await productdb.findByIdAndUpdate({ _id: deleteid },{$set:{isDeleted:1}})
        res.redirect('/admin/productslist')

    } catch (error) {
        console.log(error);
    }
}


//POST -Adding product                                       <--------ADDINGG IN TO Database                                             
exports.addproducttodb = async (req, res) => {
    try {
        console.log("1");
        const arrImages = [];
        if (req.files) {
            for (let i = 0; i < req.files.length; i++) {
                arrImages.push(req.files[i].filename);
            }
        }
        console.log("2");
        // console.log(req.body.name, req.body.brand, req.body.price);
        const product = new productdb({
            name: req.body.name,
            brand: req.body.brand,
            price: req.body.price,
            size: req.body.size,
            category: req.body.categoryName,
            description: req.body.description,
            image: arrImages,
            quantity: req.body.quantity,
            isCreated: new Date()
        })
        // console.log(product);
        const insertproduct = await product.save();
        // console.log("product added is ");
        // console.log(insertproduct);
        if (insertproduct) {
            res.status(200).redirect('/admin/productslist')

        } else {
            res.status(400).send({ succces: false, msg: error.message });
            console.log("error in inserting product");
        }

    } catch (error) {
        console.log(error.message);
    }

}

//GET- updating the PRODUCT
exports.updateproduct = async (req, res) => {
    try {
        const id = req.query.productid
        const product_data = await productdb.findById({ _id: id });
        const category = await categorydb.find({})
        res.render("updateproduct", { product: product_data, category: category });
    } catch (error) {
        console.log(error.message);
    }
};


//post-updating product &                  <--------UPDATING IN TO Database-------->
exports.updateproduct_todb = async (req, res) => {
    try {

        // console.log(req.body.id, req.body.name, req.body.brand, req.body.price);
        const arrImages = [];
        let product
        console.log(req.files.length);

        if (req.files.length>0) {
            for (let i = 0; i < req.files.length; i++) {
                console.log(req.files[i].filename);
                arrImages.push(req.files[i].filename);
            }
           console.log("if condition");
           product  = {
                name: req.body.name,
                brand: req.body.brand,
                price: req.body.price,
                size: req.body.size,
                category: req.body.categoryName,
                description: req.body.description,
                image: arrImages,
                tax: req.body.tax,
                quantity: req.body.quantity,
                isCreated: new Date()
            }
        }
        else{
           console.log("else condition");

            product = {
                name: req.body.name,
                brand: req.body.brand,
                price: req.body.price,
                size: req.body.size,
                category: req.body.categoryName,
                description: req.body.description,
                tax: req.body.tax,
                quantity: req.body.quantity,
                isCreated: new Date()
            }
        }

        const data = await productdb.updateOne({ _id: req.body.id }, { $set: product })
        const updateddata = await productdb.findOne({_id: req.body.id})
        // console.log(updateddata);


        if (data) {
            res.status(200).redirect('/admin/productslist')

        } else {
            res.status(400).redirect('/admin/productslist')
            console.log("error in inserting product");
        }

    } catch (error) {
        console.log(error.message);
    }

}


//POST - offerUpdate in database
exports.offerUpdate=async(req,res)=>{
   
    try {
        const isOffer = req.body.isOffer
        const offer = req.body.offer
        const id = req.body.id
        const currentPrice = req.body.currentPrice
        console.log(isOffer,offer,id,currentPrice);

        const discount =Math.trunc( (currentPrice - offer) / currentPrice * 100)
        console.log(discount);

if(isOffer=="true"){
    console.log("checked true case");
    const updateProducts = await productdb.findOneAndUpdate({_id:id},{$set:{price:offer,isOffer:isOffer,offer:currentPrice}})
    res.status(200).send({message:"offerAdded"})
}else{
    const isOffer = false
    const offer = req.body.offer
    const currentPrice = req.body.currentPrice
    console.log("checked false case");
    const updateProducts = await productdb.findOneAndUpdate({_id:id},{$set:{price:offer,isOffer:isOffer,offer:currentPrice}})
    res.status(200).send({message:"offerRemoved"})
}

    } catch (error) {
        console.log(error.message);
    }


}






//                          <----------------------CATEGORY LISTING AND ADDING---------------------->

//GET - Loading the Category Tab
exports.categories = async (req, res) => {
    const categorydata = await categorydb.find({})
    res.render('categories', { categorydata: categorydata })
}



//POST - Adding a category in db
exports.addcategory = async (req, res) => {
    try {
        
        const newName = req.body.name.toLowerCase()
        const description = req.body.description
        console.log(newName);
       
        const nameInDb = await categorydb.findOne({ name: newName })
       

        if (nameInDb!=null && nameInDb.name.toLowerCase() === newName) {
            console.log("category already added")
            res.send({ messsage: "category already added" })

        } else {
            console.log("category added")
            const newCategory = new categorydb({
                name: req.body.name.toLowerCase(),
                description: description,
                block: "List"
            })

            const category = await newCategory.save()

            console.log(category);
            res.send({message: "category added"})
        }
    } catch (error) {
        console.log(error.message);
    }
}

// for deleting a category
exports.deletecategory = async (req, res) => {
    try {

        const category = await categorydb.findByIdAndDelete(req.body.id)

        res.redirect("/admin/categories")
    } catch (error) {
        console.log(error.message);
    }
}


//Listing and Unlisting a category
exports.categoriesList_Unlist = async (req, res) => {
    const documentId = req.params.id;
    console.log(documentId)
    const newStatus = req.body.status;
    console.log(newStatus)

    try {
        // Update the document's status in the database
        const done = await categorydb.findByIdAndUpdate(documentId, { block: newStatus });
        res.status(200).json({ message: 'Status updated successfully' })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating status' })
    }
}


//GET  -  ORDER TAB 
exports.order = async (req, res) => {
    try {

     const order= await orderdb.find({}).populate('userId')
  
if(order){
    res.render('orders',{order:order})
}else{
    res.render('orders')
}
    
} catch (error) {
    console.log();
}
}



//ORDER STATUS UPDATING 
exports.updateOrderStatus=async(req,res)=>{


    let orderId = req.body.orderId;
    let status  = req.body.status;
    let userId=req.body.userId
    let amount=req.body.grandtotal
    
    console.log("orderId is: "+orderId)
    console.log("status is: "+status)
    console.log("userId is: "+userId)
    console.log("amount is: "+amount)

    try {

if(status=="Returned"){
    const userId = req.body.userId
    const updateOrderStatus=await orderdb.findByIdAndUpdate(orderId,{$set:{status:status}}).exec()

    const walletAdd = await walletdb.findOneAndUpdate({userId:new ObjectId(userId)},{$set:{amount:amount}})

    res.status(200).json({ success: true, message: "Status Updated Successfully" });
}
else{
    const updateOrderStatus=await orderdb.findByIdAndUpdate(orderId,{$set:{status:status}}).exec()
    console.log(updateOrderStatus)
    
    if(updateOrderStatus){
        res.status(200).json({ success: true, message: "Status Updated Successfully" });
    }
    else{
        res.status(500).json({ success: false, message: "An error occurred" });

    }
}


    
} catch (error) {
    console.log(error.message);
}
}


//ORDER DETAILS
exports.orderdetails=async(req,res)=>{

const orderid=req.query.id
console.log(orderid);
try {
    const order= await orderdb.find({_id:orderid}).populate('userId').populate('address')
    console.log(order)
if(order){
    res.render('orderdetails',{order:order})
}else{
    res.render('orderdetails')
}
    
} catch (error) {
    console.log();
}

}



//FETCH CHART DATA
exports.fetchChartData = async (req,res)=> {

    try {
        const salesData = await orderdb.aggregate([
            { $match: { status: 'Delivered' } },  { $group: { _id: { $dateToString: { format: '%Y-%m-%d',date: { $toDate: '$purchased' } }},totalRevenue: { $sum: '$grandtotal' } }},
            {$sort: { _id: -1 }},{$project: { _id: 0, date: '$_id',totalRevenue: 1}},{$limit: 4}]);
    
           
          console.log(salesData);
    
          const data = [];
          const date = [];
        for (const totalRevenue of salesData) {
            data.push(totalRevenue.totalRevenue);
          }
        
            for (const item of salesData) {
            date.push(item.date);
          }
             date.reverse()
        
          
        // console.log("DATA iS");
        // console.log(data);
          
        // console.log("DATE iS");
        // console.log(date);
    

        res.status(200).send({ data:data, date:date })
  
    } catch (error) {
        console.log(error.message);
    }
    
  };



//         <-----------------------Add coupons -------------------------------->


//GET- coupon page 
exports.coupons=async(req,res)=>{
    const couponlist = await coupondb.find({})

    res.render('coupons',{couponlist:couponlist})
}
  
//GET- Coupon Add Page
exports.addcoupon=async(req,res)=>{
    const couponlist = await coupondb.find({})

    res.render('addcoupon',{couponlist:couponlist})
}


  
//POST- Adding the Coupon
exports.addcoupon_post = async(req,res)=>{
    try { 
    console.log(req.body.title);
        const name = letterCaseChangerHelper.toTitleCase(req.body.title)
        const description = req.body.description.trim();
        const discount = req.body.discount.trim();
        const expiry = req.body.expiry.trim();
        
        console.log("coupon name is : "+name);

    const newCoupon=new coupondb({
        name:name,
        description:description,
        discount:discount,
        expiry: new Date(Date.now()+ parseInt(expiry)*24 * 60 * 60 * 1000)
                                })

        
    const couponSave=newCoupon.save().then(()=> console.log("coupon Saved Successfully"))
                                     .catch((error)=>  console.log(error.message))
    
    console.log(couponSave);
    if(couponSave){
        res.redirect('/admin/coupons')
    }

    } catch (error) {
            console.log(error.message);        
    }
    }
  

//POST - coupon delete 

exports.deletecoupon = async (req,res)=>{
    try {
        const couponId=req.body.id
        const deletedCoupon = await coupondb.findByIdAndDelete({_id:couponId})    
        if(deletedCoupon){
            res.status(200).send({ message:"success"})
        }
    } catch (error) {
        console.log(error.message);
    }
     
}


//GET - BannerManagement
exports.bannerManagement=async(req,res)=>{
    try {
        let banners=await bannerdb.findOne({})
        console.log(banners);
        res.render('bannerManagement',{banners:banners})    
    } catch (error) {
        console.log(error.message);
    }
    
}


//POST - Banner Image Upload
exports.bannerImageupload=async(req, res) => {


    try {
        
    const query = req.query.num
    console.log(req.file); 
    console.log("query is: "+query);

    if (req.file) {

            if(query==1){
                
                const banner = await bannerdb.findOne({})
                const bannerupload = await bannerdb.findOneAndUpdate({_id:banner._id},{$set:{image1:req.file.filename}})
                console.log(bannerupload);
                res.redirect("back")
            }
            else if(query==2){
                const banner = await bannerdb.findOne({})
                const bannerupload = await bannerdb.findOneAndUpdate({_id:banner._id},{$set:{image2:req.file.filename}})
                console.log(bannerupload);
                res.redirect("back")
            }
            else if(query==3){
                const banner = await bannerdb.findOne({})
                const bannerupload = await bannerdb.findOneAndUpdate({_id:banner._id},{$set:{image3:req.file.filename}})
                console.log(bannerupload);
                res.redirect("back")
            }
            else {
                const banner = await bannerdb.findOne({})
                const bannerupload = await bannerdb.findOneAndUpdate({_id:banner._id},{$set:{image4:req.file.filename}})
                console.log(bannerupload);
                res.redirect("back")
            }
     
    } else {
      res.status(400).send('File upload failed');
    }


        } catch (error) {
            console.log(error.message);    
        }
  }






exports.salesreport =async (req, res) => {

    try {

        const orders= await orderdb.find({}).populate('userId')
        console.log("orders in order page");
        console.log(orders[1].userId.name);
        console.log("00000000000000000000000000000000000000000000000000");
        console.log(orders);
       
      
     
   if(orders){
       res.render('salesreport',{orders:orders})
   }else{
       res.render('salesreport')
   }
       
   } catch (error) {
       console.log();
   }


}





exports.adminpage_form_productadd = (req, res) => {
    res.render('adminpage_form_productadd')
}