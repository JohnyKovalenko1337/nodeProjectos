const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'ty7ui', {dialect:'mysql', host:'localhost'});

module.exports = sequelize;

