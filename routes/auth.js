const express = require('express');


const Router= express.Router();

const authController = require('../controllers/auth');

Router.get('/login',authController.getLogin);

module.exports = Router;