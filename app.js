const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
// ======================================== models ===========================
const User = require('./models/user')
//============================templates================================================>
app.set('view engine', 'ejs');
app.set('views', 'views');
//<=========================Controllers and routes=========================================
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const AuthRouter = require('./routes/auth');
//<======================================================================================
app.use(bodyParser.urlencoded({ extended: false }));           // syntax for body Parser
app.use(express.static(path.join(__dirname, 'public')));     // for static styles 

//======================================Middlewares==================================
app.use((req, res, next) => {
  User.findById('5ede4f2d46955c1d107dab58')
    .then(user => {
      req.user = user
      next();
    })
    .catch(err => {
      console.log(err);
    })
})


app.use('/admin', adminRoutes);              //'hidden' middleware for admin.ejs

app.use(shopRoutes);                            //middleware for shop.ejs
app.use(AuthRouter);
app.use(errorController.prob);

// =================================================================================
mongoose.connect('mongodb+srv://sadJo:qwerty123@cluster0-am1ix.mongodb.net/test?retryWrites=true&w=majority',{ useUnifiedTopology: true, useNewUrlParser: true  })
.then(()=>{
  User.findOne().then((user)=>{
    if(!user){
      const user = new User({
        name:'SadyJO',
        email:'ejik1337@gmail.com',
        cart:{
          items: []
        }
      });
      user.save();
    }
  })
 
 
  console.log('success');
  app.listen(3000);
})
.catch(err => {
  console.log(err);
})

