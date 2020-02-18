const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./util/database');

const app = express();
//============================templates================================================>
app.set('view engine', 'ejs');
app.set('views', 'views');              
//<=========================Controllers and routes=========================================
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

//<======================Models================================================>
const CartItem = require('./models/cart-item');
const Cart = require('./models/cart');
const User = require('./models/user');
const Products = require('./models/product');
const Order = require('./models/orders');
const OrderItem = require('./models/order-items');
//<======================================================================================
app.use(bodyParser.urlencoded({extended: false}));           // syntax for body Parser
app.use(express.static(path.join(__dirname,'public')));     // for static styles 

//======================================Middlewares==================================
app.use((req,res,next)=>{
  User.findByPk(1)
  .then(user =>{
    req.user = user;
    next();
  })
  .catch(err=>{
    console.log(err);
  })
})

app.use('/admin',adminRoutes);              //'hidden' middleware for admin.ejs

app.use(shopRoutes);                            //middleware for shop.ejs

app.use(errorController.prob);

//==========================Associations======================================

Products.belongsTo(User,{
  constraints:true,
  onDelete:'CASCADE'
});
User.hasMany(Products);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Products, { through: CartItem});
Products.belongsToMany(Cart, { through: CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Products, {through: OrderItem});
Products.belongsToMany(Order, { through: OrderItem});


sequelize.sync()
.then(res => {
  return User.findByPk(1);
})
.then(user => {
  if(!user){
    return  User.create({name:"Johny", email:"esketit123@yahoo.com"});
    
  }
  return user;
})
.then(user => {
  return user.createCart()
})
.then(res=>{
  app.listen(3000);
})
.catch(err=>{
  console.log(err);
});


