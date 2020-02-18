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
    req.user.createProduct({
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
    })
    .then(result =>{
        console.log(result);
        res.redirect('/');
    })
    .catch(err =>{console.log(err);});
                                                
}
exports.getEditProduct=(req,res,next) =>{
    const editMode = req.query.edit;
    if(!editMode){
        return res.redirect('/');
    }
    const prodId = req.params.ProductId;
    req.user.getProducts({where: {id:prodId}})
    .then(products =>{
        const product = products[0];
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
    Products.findByPk(prodId)
    .then(product=>{
        return product.destroy();
    })
    .then(result=>{
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
    Products.findByPk(prodId)
    .then(product=>{
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDescription;
        product.imageUrl = updatedImageUrl;
        return product.save();
    })
    .then(result => {
        console.log('Updated product!');
        res.redirect('/admin/products');
;    })
    .catch(err=>{
        console.log(err);
    });
    
}
exports.getProducts =(req,res,next )=>{
    req.user.getProducts().
    then(products =>{
    res.render('./admin/products', 
    {prods: products,
    docTitle:'Products',                           //render templates called shop
    path:'/admin/products', 
    }); 
})
.catch(err=>{console.log(err);})
};