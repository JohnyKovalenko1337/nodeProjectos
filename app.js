const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
//<============================================================================
const MONGODB_URI = 'mongodb+srv://sadJo:qwerty123@cluster0-am1ix.mongodb.net/test';
const app = express();
const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
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
app.use(session({secret: 'team secret', resave: false, saveUninitialized: false,store: store}))
//======================================Middlewares==================================
app.use((req, res, next) => {
  if(!req.session.user){
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
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
mongoose.connect(MONGODB_URI,{ useUnifiedTopology: true, useNewUrlParser: true  })
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

