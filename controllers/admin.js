
const Products = require('../models/product');

const { validationResult } = require('express-validator');
const fileHelper = require('../util/file');

exports.getAddProduct=(req,res,next) =>{
    res.render('./admin/edit-product',{ 
        docTitle:'Add-products',
        path:'/admin/add-product',
        editing: false,
        hasError: false,
        errorMessage: null,
        validateErrors: []
    }); 
}
exports.postAddProduct=(req,res,next) =>{
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    if(!image){
        return res.status(422).render('./admin/edit-product',{ 
            docTitle:'Add product',
            path:'/admin/add-product',
            editing: false,
            hasError: true,
            product: 
            {
                title:title, 
                price:price, 
                description: description, 
            },
            errorMessage: 'Attached file is not an image',
            validateErrors: []
        }); 
    }
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).render('./admin/edit-product',{ 
            docTitle:'Add product',
            path:'/admin/add-product',
            editing: false,
            hasError: true,
            product: 
            {
                title:title, 
                price:price, 
                description: description, 
            },
            errorMessage: errors.array()[0].msg,
            validateErrors: errors.array()
        }); 
    }
    const imageUrl = image.path;
    const product = new Products({
        title:title, 
        price:price, 
        description: description, 
        imageUrl: imageUrl,
        userId: req.user
    });
    product.save()                      // save method from mongoose
        .then(result =>{
            console.log('admin.js');
            console.log(result);
            res.redirect('/admin/products');
            
        })
        .catch(err =>{
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);});
}
exports.getProducts =(req,res,next )=>{
    Products
    .find({userId:req.user._id})
    //.populate('userId')             // mongoose method which return data by the query
    .then(products =>{
    res.render('./admin/products', 
    {prods: products,
    docTitle:'Products',                           //render templates called shop
    path:'/admin/products'
    }); 
})
.catch(err=>{
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);})
}; 

exports.getEditProduct=(req,res,next) =>{
    const editMode = req.query.edit;
    if(!editMode){
        return res.redirect('/');
    }
    const prodId = req.params.ProductId;
    Products.findById(prodId)               // findById mongoose method
    .then(product =>{
        if(!product){
            res.redirect('/');
        }
        res.render('./admin/edit-product',{ 
            docTitle:'Edit-product',
            path:'/admin/edit-product',
            editing: editMode,
            product: product,
            hasError: false,
            errorMessage: null,
            validateErrors: []
        }); 
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
        //res.redirect('/500');
    })
}

exports.postDeleteProduct=(req,res,next) =>{
    const prodId = req.body.productId;
    Products.findById(prodId)
    .then(product=>{
        if(!product){
            return next(new Error('No product found'))
        }
        fileHelper.deleteFile(product.imageUrl);
        return Products.deleteOne({_id: prodId, userId: req.user._id});
    })
    .then(()=>{
        console.log('Product has been destroyed successfuly');
        res.redirect('/admin/products'); 
    })
    .catch(err=>{
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);});
    
    
}

exports.postEditProduct=(req,res,next)=>{
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImage = req.file;
    const updatedDescription = req.body.description;
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        console.log(errors.array())
        return res.status(422).render('./admin/edit-product',{ 
            docTitle:'Edit product',
            path:'/admin/edit-product',
            editing: true,
            hasError: true,
            product: 
            {
                title:updatedTitle, 
                price:updatedPrice, 
                description: updatedDescription, 
                _id: prodId
            },
            errorMessage: errors.array()[0].msg,
            validateErrors: errors.array()
        }); 
    }
    Products.findById(prodId)
    .then(product=>{
        if(product.userId.toString() !== req.user._id.toString()){
            return res.redirect('/');
        }
        product.title = updatedTitle;
        product.price = updatedPrice;
        if(updatedImage){
            fileHelper.deleteFile(product.imageUrl);
            product.imageUrl = updatedImage.path;
        }
        
        product.description = updatedDescription;
        return  product
            .save()
            .then(()=> {
                console.log('Updated product!');
                res.redirect('/admin/products');  
            });
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
   
}

