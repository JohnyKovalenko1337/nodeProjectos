const express = require('express');
const path = require('path');
const rootDir = require('../util/path');

const {body} = require('express-validator');
const Router= express.Router();

const isAuth = require('../middleware/is-auth');

const adminController = require('../controllers/admin');


Router.get('/add-product',  isAuth,  adminController.getAddProduct ) ;

Router.post('/add-product',
    [
        body('title')
            .isString()
            .isLength({ min:2 })
            .trim(),

        body('price')
            .isFloat(),
        body('description')
            .isString()
            .isLength({ max:100 })
            .trim()
    ],
    isAuth,
    adminController.postAddProduct) ;

Router.get('/products', isAuth,  adminController.getProducts) ;

Router.get('/edit-product/:ProductId', isAuth, adminController.getEditProduct) ;

Router.post ('/edit-product',
    [
        body('title')
            .isString()
            .isLength({ min:3 })
            .trim(),
        body('price')
            .isFloat(),
        body('description')
            .isString()
            .isLength({ max:100 })
            .trim()
    ],
    isAuth,
    adminController.postEditProduct);

Router.delete('/product/:productId', isAuth,  adminController.deleteProduct) ; 



module.exports=Router;
