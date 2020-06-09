const express = require('express');

const Router= express.Router();         
const shopController = require('../controllers/shop');

Router.get('/',shopController.getIndex ) ;

Router.get('/products',shopController.getProducts ) ;

Router.get('/products/:productId',shopController.productId);

Router.get('/cart',shopController.getCart ) ;

Router.post('/cart', shopController.postCart);

Router.post('/cart-delete-item', shopController.postCartDelete);

Router.post('/create-order', shopController.postOrder);

Router.get('/orders',shopController.getOrder) ;   

//Router.get('/checkout',shopController.getCheckout ) ;

module.exports =Router;