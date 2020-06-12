const express = require('express');


const Router= express.Router();

const authController = require('../controllers/auth');

Router.get('/login',authController.getLogin);

Router.get('/signup',authController.getSignup);

Router.post('/login',authController.postLogin);

Router.post('/signup',authController.postSignup);

Router.post('/logout',authController.postLogout);

module.exports = Router;