const express = require('express');
const path = require('path');
const rootDir = require('../util/path');

const Router= express.Router();

const isAuth = require('../middleware/is-auth');

const adminController = require('../controllers/admin');
// /admin/add-product/ => /get/
Router.get('/add-product', isAuth,  adminController.getAddProduct ) ;
// /admin/add-product/ => /post
Router.post('/add-product',isAuth, adminController.postAddProduct) ;
// /admin/products/ => /get/

Router.get('/products', isAuth,  adminController.getProducts) ;

Router.get('/edit-product/:ProductId', isAuth,  adminController.getEditProduct) ;

Router.post ('/edit-product',isAuth, adminController.postEditProduct);

Router.post('/delete-product', isAuth,  adminController.postDeleteProduct) ; 
module.exports=Router;
