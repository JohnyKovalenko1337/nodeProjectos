const Products = require('../models/product');
const Order = require('../models/orders');
//<====================================================products================================================
exports.getProducts = (req,res,next) =>{
    Products.findAll()
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
    Products.findByPk(prodId).then(product=>{
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
    Products.findAll().then(products => {
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
    req.user.getCart()          //req.user defined by middleware in app.js getCart method created by sequelize because we have assosiatin with Cart
    .then(cart=>{
        return cart.getProducts() //getProducts method created by sequelize because we have assosiatin with Products
        .then(products =>{
            res.render('shop/cart',{
                path: '/cart',
                docTitle: 'Your cart',
                products: products
            });
        })
        .catch(err=>{console.log(err);})})
    .catch(err=>{console.log(err);});
}

exports.postCartDelete=(req,res,next)=>{
    const prodId = req.body.productId;
    req.user.getCart()
    .then(cart=>{
        return cart.getProducts({where: {id : prodId}})
    })
    .then(products=>{
        const product = products[0];
        return product.cartItem.destroy();      //cartItem defined in model CartItem so by using this we define this model
    })
    .then(()=>{
        res.redirect('/cart');
    })
    .catch(err=>{console.log(err);})
};

exports.postCart =(req,res,next )=>{
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user.getCart()
    .then(cart=>{
        fetchedCart = cart;
        return cart.getProducts({where:{id:prodId}})
    })
    .then(products =>{
        let product;
        if(products.length>0){
            product = products[0];
        }
        if(product){
            const oldQuantity = product.cartItem.quantity;
            newQuantity = 1 + oldQuantity;
            return product;
        }
        return Products.findByPk(prodId)
    })
    .then(product =>{
        return fetchedCart.addProducts(product, {through:{quantity: newQuantity}})})
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
    req.user.getCart()
    .then(cart =>{
        fetchedCart = cart;
        return cart.getProducts();
    })
    .then(products=>{
        return req.user.createOrder()
            .then(order=>{
                    order.addProducts(
                        products.map(product =>{
                        product.orderItem={quantity:product.cartItem.quantity};
                        return product;
                }))
            })
            .catch(err=>{console.log(err);})
    })
    .then(()=>{
        return fetchedCart.setProducts(null);   
        
    })
    .then(()=>{
        res.redirect('/orders');    
    })
    .catch(err=>console.log(err));
}

exports.getOrder =(req,res,next )=>{
    req.user.getOrders({include: ['products']})
    .then(orders=>{
        res.render('./shop/orders',{
            path: '/orders',
            docTitle: 'Your Order',
            orders: orders
        })
    })
    .catch(err=>{console.log(err);});
}

