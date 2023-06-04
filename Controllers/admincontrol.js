
const customerdetail = require("../model/userdetailsdb")
const bcrypt = require('bcrypt')
const categorydb = require("../model/categorydb")
const productdb = require('../model/productsdb')



//                            <--------------------------ADMIN LOGIN AND VALIDATIONS------------------------------->


//login page
exports.login = (req, res) => {
    res.render('login')
}

//POST login page
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

//dashboard
exports.dashboard = (req, res) => {
    res.render('dashboard')
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
        const category = await productdb.find({}).populate("category_id")
        console.log(category);
        res.render('productslist', { category: category })

    } catch (error) {
        console.log(error.message);
    }
}

//Add Product
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

        console.log(req.params.productid)
        const deleteid = req.body.id
        const userid = await productdb.deleteOne({ _id: deleteid })
        res.redirect('/admin/productslist')

    } catch (error) {
        console.log(error);
    }
}


//POST -Adding product                                       <--------ADDINGG IN TO Database                                             
exports.addproducttodb = async (req, res) => {
    try {
        const arrImages = [];
        if (req.files) {
            for (let i = 0; i < req.files.length; i++) {
                arrImages.push(req.files[i].filename);
            }
        }
        console.log(req.body.name, req.body.brand, req.body.price);
        const product = new productdb({
            name: req.body.name,
            brand: req.body.brand,
            price: req.body.price,
            size: req.body.size,
            category_id: req.body.category_id,
            description: req.body.description,
            image: arrImages,
            tax: req.body.tax,
            quantity: req.body.quantity,
            isCreated: new Date()
        })
        console.log(product);
        const insertproduct = await product.save();
        console.log(insertproduct);
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
        const product_data = await productdb.findById({ _id: id }).populate("category_id");
        const category = await categorydb.find({})
        res.render("updateproduct", { product: product_data, category: category });
    } catch (error) {
        console.log(error.message);
    }
};


//post-updating product &                                   <--------UPDATING IN TO Database 
exports.updateproduct_todb = async (req, res) => {
    try {

        console.log(req.body.id, req.body.name, req.body.brand, req.body.price);
        const arrImages = [];
        if (req.files) {
            for (let i = 0; i < req.files.length; i++) {
                arrImages.push(req.files[i].filename);
            }
        }

        const product = {
            name: req.body.name,
            brand: req.body.brand,
            price: req.body.price,
            size: req.body.size,
            category_id: req.body.category_id,
            description: req.body.description,
            image: arrImages,
            tax: req.body.tax,
            quantity: req.body.quantity,
            isCreated: new Date()
        }

        const data = await productdb.updateOne({ _id: req.body.id }, { $set: product })

        console.log(data);


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


//                          <----------------------CATEGORY LISTING AND ADDING---------------------->

//GET - Loading the Category Tab
exports.categories = async (req, res) => {
    const categorydata = await categorydb.find({})
    res.render('categories', { categorydata: categorydata })
}



//POST - Adding a category in db
exports.addcategory = async (req, res) => {
    try {
        const newName = req.body.name
        const description = req.body.description
        console.log(newName);
       
        const nameInDb = await categorydb.findOne({ name: newName })

        if (nameInDb && nameInDb.name == newName) {
            console.log("category already added")
            res.send({ messsage: "category already added" })

        } else {
            console.log("category added")
            const newCategory = new categorydb({
                name: req.body.name,
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










exports.adminpage_orders = (req, res) => {
    res.render('adminpage_orders')
}

exports.adminpage_sellers_list = (req, res) => {
    res.render('adminpage_sellers_list')
}
exports.adminpage_form_productadd = (req, res) => {
    res.render('adminpage_form_productadd')
}