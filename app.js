const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const mongoConnect = require('./util/database').mongoConnect;
const app = express();
const User = require('./models/user')
//============================templates================================================>
app.set('view engine', 'ejs');
app.set('views', 'views');              
//<=========================Controllers and routes=========================================
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

//<======================================================================================
app.use(bodyParser.urlencoded({extended: false}));           // syntax for body Parser
app.use(express.static(path.join(__dirname,'public')));     // for static styles 

//======================================Middlewares==================================
app.use((req,res,next)=>{
  User.findById('5eab37085a96e6b87fe89492')
  .then(user =>{
    req.user = new User(user.name,user.email,user.cart,user._id);
    next();
  })
  .catch(err=>{
    console.log(err);
  })
})

app.use('/admin',adminRoutes);              //'hidden' middleware for admin.ejs

app.use(shopRoutes);                            //middleware for shop.ejs

app.use(errorController.prob);

// =================================================================================
mongoConnect((client)=>{
    
    app.listen(3000);
})
