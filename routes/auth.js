const express = require('express');


const Router= express.Router();

const authController = require('../controllers/auth');

Router.get('/login',authController.getLogin);

Router.post('/login',authController.postLogin);

Router.post('/logout',authController.postLogout);

module.exports = Router;