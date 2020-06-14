const express = require('express');
const isAuth = require('../middleware/is-auth');

const Router= express.Router();

const authController = require('../controllers/auth');

Router.get('/login',authController.getLogin);

Router.get('/signup',authController.getSignup);

Router.get('/reset',authController.getReset );

Router.get('/reset/:token',authController.getNewPassword);

Router.post('/new-password',authController.postNewPassword);

Router.post('/reset',authController.postReset);

Router.post('/login',authController.postLogin);

Router.post('/signup',authController.postSignup);

Router.post('/logout',authController.postLogout);

module.exports = Router;