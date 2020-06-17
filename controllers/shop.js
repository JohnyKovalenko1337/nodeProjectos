const Products = require('../models/product');
const Order = require('../models/order');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
//<====================================================products================================================
exports.getProducts = (req,res,next) =>{
    Products.find()                     //mongoose method find()
    .then(products => {
        res.render('./shop/product-list', 
            {prods: products,
            docTitle:'Products',                           //render templates called shop
            path:'/shop'
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
    Products.find()                     // mongoose method find()
    .then(products => {
        res.render('./shop/index', 
        {prods: products,
        docTitle:'Shop',                           //render templates called shop
        path:'/'
        }); 
    })
    .catch(err=>{
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
exports.postOrder= (req,res,next)=>{
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
