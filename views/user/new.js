
exports.productsearch=async(req,res)=>{
    try{
    const proname=req.body.pname
    const usersession=req.session.userid
    let productnamelower= proname.toLowerCase().replace(/\s/g,"");
    const data=await collection.findOne({email:usersession})   
    
    const product_data = await product.find({productnamelower:{$regex: '.*'+productnamelower+'.*',$options:'i'}})
    
    res.render('products',{products:product_data,session:usersession,title:"Hi, "+data.name, session:usersession})
    }catch(error){
        res.status(404).render('error',{error:error.message})
    }

        }




function filterProducts() {
    const checkboxes = document.querySelectorAll('.filter-checkbox:checked');
    const selectedCategories = Array.from(checkboxes).map(checkbox => checkbox.id);

    const productItems = document.querySelectorAll('.product-item');

    productItems.forEach(item => {
      const category = item.dataset.category;

      if (selectedCategories.includes(category)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
      });
    }