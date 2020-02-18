const express = require('express');
const path = require('path');
const rootDir = require('../util/path');

const Router= express.Router();

const adminController = require('../controllers/admin');
// /admin/add-product/ => /get/
Router.get('/add-product',   adminController.getAddProduct ) ;
// /admin/products/ => /get/
Router.get('/products',   adminController.getProducts) ;
// /admin/add-product/ => /post
Router.post('/add-product', adminController.postAddProduct) ;

Router.get('/edit-product/:ProductId',   adminController.getEditProduct) ;

Router.post ('/edit-product', adminController.postEditProduct);

Router.post('/delete-product',   adminController.postDeleteProduct) ;
module.exports=Router;
