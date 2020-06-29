const Products = require('../models/product');
const Order = require('../models/order');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const product = require('../models/product');
const stripe = require('stripe')(process.env.STRIPE_KEY);

const ITEMS_PER_PAGE = 3;
//<====================================================products================================================
exports.getProducts = (req,res,next) =>{
    const page = +req.query.page || 1;
    let totalItems;
    
    Products.find().countDocuments()
        .then((numProducts)=>{
            totalItems = numProducts;
            return  Products.find()                     // mongoose method find()
                .skip( ( page - 1 ) * ITEMS_PER_PAGE )      // skips items cuz of pagination
                .limit(ITEMS_PER_PAGE)
        })
        .then(products => {
            res.render('./shop/product-list', 
            {prods: products,
            docTitle:'Products',                           //render templates called shop
            path:'/products',
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            }); 
        })
        .catch(err=>{
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}
//<===============================================productDetail===============================================
exports.productId=(req,res,next)=>{
    const prodId = req.params.productId;
    Products.findById(prodId).then(product=>{       // mongoose method find by id
        res.render('./shop/product-detail', {
            product : product,
            docTitle: product.title,
            path: '/products'
        });
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}
//=======================================================index==================================
exports.getIndex =(req,res,next )=>{
    const page = +req.query.page || 1;
    let totalItems;

    Products.find().countDocuments()
    .then((numProducts)=>{
        totalItems = numProducts;
        return  Products.find()                     // mongoose method find()
            .skip( ( page - 1 ) * ITEMS_PER_PAGE )      // skips items cuz of pagination
            .limit(ITEMS_PER_PAGE)
    })
    .then(products => {
        res.render('./shop/index', 
        {prods: products,
        docTitle:'Shop',                           //render templates called shop
        path:'/',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        }); 
    })
    .catch(err=>{
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
   
};
//======================================================cart=====================================================
exports.getCart =(req,res,next )=>{
    req.user                                //req.user defined by middleware in app.js
    .populate('cart.items.productId')           //  mongoose method to get data from query 
    .execPopulate()                         // method which return promise from populate     
    .then(user =>{
        const products = user.cart.items;
        res.render('shop/cart',{
            path: '/cart',
            docTitle: 'Your cart',
            products: products
        });
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });

}

exports.postCartDelete=(req,res,next)=>{
    const prodId = req.body.productId;
    req.user.deleteItemFromCart(prodId)
    .then((result)=>{
        res.redirect('/cart');
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
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
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
   
}
//<====================================================Orders============================================

exports.getOrder =(req,res,next )=>{
    Order.find({"user.userId": req.user._id})
    .then(orders=>{
        res.render('./shop/orders',{
            path: '/orders',
            docTitle: 'Your Order',
            orders: orders
        })
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

// ===========================================Invoice ===========================================
exports.getInvoice = (req,res,next)=>{
    const orderId = req.params.orderId;
    Order.findById(orderId).then(order=>{
        if(!order){
            return next(new Error('no order found'))
        }
        if(order.user.userId.toString() !== req.user._id.toString()){
            return next(new Error('UnAuthorized'))
        }
        const invoiceName = 'invoice-'+orderId+'.pdf'; 
        const invoicePath = path.join('invoices' , invoiceName);

        const pdfDoc = new PDFDocument();

        res.setHeader('Content-Type', 'application/pdf');

        res.setHeader('Content-Disposition', 'inline');

        pdfDoc.pipe(fs.createWriteStream(invoicePath))
        pdfDoc.pipe(res);
        pdfDoc.fontSize(26).text('Invoice', {
            underline: true
        });
        pdfDoc.text('-----------------------');
        let totalPrice = 0;
        order.products.forEach(prod => {
            totalPrice += prod.quantity * prod.productData.price;
            pdfDoc
            .fontSize(14)
            .text(
                prod.productData.title +
                ' - ' +
                prod.quantity +
                ' x ' +
                '$' +
                prod.productData.price
            );
        });
      pdfDoc.text('------------------------------------');
      pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);
      pdfDoc.text('------------------------------------');
      pdfDoc.end();
    })
    .catch(err=>{
        next(err);
    })
}
//<===================================================CheckOut===================================

exports.getCheckout = (req,res,next)=>{
    let products;
    let total = 0;
    req.user                                
    .populate('cart.items.productId')            
    .execPopulate()
    .then(user =>{
        products = user.cart.items;
        total=0;
        products.forEach(p=>{
            total = total + p.quantity * p.productId.price;
        })

        return stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: products.map(p=>{
                return {
                    name: p.productId.title, 
                    description: p.productId.description, 
                    amount:p.productId.price * 100,
                    currency:'usd',
                    quantity:p.quantity
                }
            }),
            success_url: req.protocol + '://' +req.get('host')+'/checkout/success', //localhost:3000
            cancel_url:  req.protocol + '://' +req.get('host')+'/checkout/cancel'
        });
    })
    .then(session=>{
        res.render('./shop/checkout',{
            path: '/checkout',
            docTitle: 'Your Checkout',
            products: products,
            totalSum: total,
            sessionId: session.id
        })
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
}

exports.getCheckoutSuccess= (req,res,next)=>{
    req.user                                
    .populate('cart.items.productId')            
    .execPopulate()
    .then(user =>{
        const products = user.cart.items.map(i=>{
            return {quantity: i.quantity, productData: {...i.productId._doc}}
        });
        const order = new Order({
            user:{
                email: req.user.email,
                userId: req.user,
            },
            products:products
        });
        return order.save();
    })
    .then(()=>{
        return req.user.clearCart();
           
    })
    .then(()=>{
        res.redirect('/orders'); 
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}