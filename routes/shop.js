const express = require('express');

const Router= express.Router();   

const shopController = require('../controllers/shop');

const isAuth = require('../middleware/is-auth');

Router.get('/',shopController.getIndex ) ;

Router.get('/products',shopController.getProducts ) ;

Router.get('/products/:productId',shopController.productId);

Router.get('/cart',isAuth,shopController.getCart ) ;

Router.post('/cart', isAuth,shopController.postCart);

Router.post('/cart-delete-item',isAuth, shopController.postCartDelete);

Router.get('/orders',isAuth,shopController.getOrder) ;   

Router.get('/orders/:orderId', isAuth, shopController.getInvoice);

Router.get('/checkout', isAuth, shopController.getCheckout ) ;

Router.get('/checkout/success', isAuth, shopController.getCheckoutSuccess) ;

Router.get('/checkout/cancel', isAuth, shopController.getCheckout ) ;

module.exports =Router;