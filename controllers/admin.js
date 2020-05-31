
const Products = require('../models/product');

exports.getAddProduct=(req,res,next) =>{
    res.render('./admin/edit-product',{ 
        docTitle:'Add-products',
        path:'/admin/add-product',
        editing: false,}); 
}
exports.postAddProduct=(req,res,next) =>{
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Products(
        title,
        price,
        description,
        imageUrl,
        null,
        req.user._id
        );
    product.save()
    .then(result =>{
        console.log('admin.js');
        console.log(result);
        res.redirect('/admin/products');
    })
    .catch(err =>{console.log(err);});
}
exports.getProducts =(req,res,next )=>{
    Products.fetchAll().
    then(products =>{
    res.render('./admin/products', 
    {prods: products,
    docTitle:'Products',                           //render templates called shop
    path:'/admin/products', 
    }); 
})
.catch(err=>{console.log(err);})
}; 

exports.getEditProduct=(req,res,next) =>{
    const editMode = req.query.edit;
    if(!editMode){
        return res.redirect('/');
    }
    const prodId = req.params.ProductId;
    Products.findById(prodId)
    .then(product =>{
        if(!product){
            res.redirect('/');
        }
        res.render('./admin/edit-product',{ 
            docTitle:'Edit-product',
            path:'/admin/edit-product',
            editing: editMode,
            product: product}); 
    })
    .catch(err=>{
        console.log(err);
    })
}

exports.postDeleteProduct=(req,res,next) =>{
    const prodId = req.body.productId;
    Products.deleteById(prodId)
    .then(()=>{
        console.log('Product has been destroyed successfuly');
        res.redirect('/admin/products'); 
    })
    .catch(err=>{console.log(err);});
    
    
}

exports.postEditProduct=(req,res,next)=>{
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    
    const product = new Products(
        updatedTitle, 
        updatedPrice,
         updatedDescription,
          updatedImageUrl, 
          prodId);

    product.save()  
    .then(()=> {
        console.log('Updated product!');
        res.redirect('/admin/products');
;    })
    .catch(err=>{
        console.log(err);
    });
   
}

