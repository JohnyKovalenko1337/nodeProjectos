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

Router.post('/create-order',isAuth, shopController.postOrder);

Router.get('/orders',isAuth,shopController.getOrder) ;   

//Router.get('/checkout',shopController.getCheckout ) ;

module.exports =Router;