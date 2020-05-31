const Products = require('../models/product');
//const Order = require('../models/orders');
//<====================================================products================================================
exports.getProducts = (req,res,next) =>{
    Products.fetchAll()
    .then(products => {
        res.render('./shop/product-list', 
            {prods: products,
            docTitle:'Products',                           //render templates called shop
            path:'/shop', 
            }); 
        })
        .catch(err=>{
            console.log(err);
        });
}
//<===============================================productDetail===============================================
exports.productId=(req,res,next)=>{
    const prodId = req.params.productId;
    Products.findById(prodId).then(product=>{
        res.render('./shop/product-detail', {
            product : product,
            docTitle: product.title,
            path: '/products'    
        });
    })
    .catch(err=>{console.log(err);});
}
//=======================================================index==================================
exports.getIndex =(req,res,next )=>{
    Products.fetchAll().then(products => {
        res.render('./shop/index', 
        {prods: products,
        docTitle:'Shop',                           //render templates called shop
        path:'/', 
        }); 
    })
    .catch(err=>{
        console.log(err);
    });
   
};
//======================================================cart=====================================================
exports.getCart =(req,res,next )=>{
    req.user.           //req.user defined by middleware in app.js
    getCart()          // getCart method created in model user.js
    .then(products =>{
        res.render('shop/cart',{
            path: '/cart',
            docTitle: 'Your cart',
            products: products
        });
    })
    .catch(err=>{console.log(err);});

}

exports.postCartDelete=(req,res,next)=>{
    const prodId = req.body.productId;
    req.user.deleteItemFromCart(prodId)
    .then((result)=>{
        res.redirect('/cart');
    })
    .catch(err=>{console.log(err);})
};

exports.postCart =(req,res,next )=>{
    const prodId = req.body.productId;
    Products.findById(prodId)
    .then(product=>{
      return req.user.addToCart(product);
       
    })
    .then(()=>{
        res.redirect('/cart');
    })
    .catch(err=>{
        console.log(err);
    })
   
}
//<====================================================Orders============================================
exports.postOrder= (req,res,next)=>{
    let fetchedCart;
    req.user
    .addOrder()
    .then(()=>{
        res.redirect('/orders');    
    })
    .catch(err=>console.log(err));
}

exports.getOrder =(req,res,next )=>{
    req.user.getOrders()
    .then(orders=>{
        res.render('./shop/orders',{
            path: '/orders',
            docTitle: 'Your Order',
            orders: orders
        })
    })
    .catch(err=>{console.log(err);});
}

