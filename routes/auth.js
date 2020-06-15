const express = require('express');

const User = require('../models/user');
const {check,body} = require('express-validator'); //destuctering by taking check func 

const Router= express.Router();

const authController = require('../controllers/auth');

Router.get('/login',authController.getLogin);

Router.get('/signup',authController.getSignup);

Router.get('/reset',authController.getReset );

Router.get('/reset/:token',authController.getNewPassword);

Router.post('/new-password',authController.postNewPassword);

Router.post('/reset',authController.postReset);

Router.post('/login',authController.postLogin);

Router.post('/signup',
    [
        check('email').isEmail().withMessage('Please input valid email').custom((value,{req})=>{
            return User.findOne({ email: value })
            .then(userDoc => {
                if (userDoc) {
                return Promise.reject('E-Mail exists already, please pick a different one.') //  async validation
                }
            })
        }),
        body('password','Please enter password with only text and numbers at least 5 symbols')
            .isLength({min:5}).isAlphanumeric(),
        body('confirmPassword').custom((value,{req})=>{
            if(value !== req.body.password){
                throw new Error('Passwords have to match');
            }
            return true;
        })
    ],
  authController.postSignup);

Router.post('/logout',authController.postLogout);

module.exports = Router;