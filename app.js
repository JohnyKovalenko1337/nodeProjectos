const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const https = require('https');

const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const csurf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
//<============================================================================
console.log(process.env.NODE_ENV);

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-am1ix.mongodb.net/${process.env.MONGO_DEFOULT_DATABASE}`;

const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const app = express();
const csurfProtection = csurf();

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'image')
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + '-' + file.originalname)
  }
})

/* const privateKey = fs.readFileSync('server.key');
const certificate = fs.readFileSync('server.cert');
 */

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  }
  else {
    cb(null, false)
  }

}
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

//<=========================================================================================
//openssl req -nodes -new -x509 -keyout server.key -out server.cert
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));
//<======================================================================================
app.use(bodyParser.urlencoded({ extended: false }));           // syntax for body Parser

app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));

app.use(express.static(path.join(__dirname, 'public')));     // for static styles 
app.use('/image', express.static(path.join(__dirname, 'image')));

app.use(session({ secret: 'team secret', resave: false, saveUninitialized: false, store: store }))

app.use(csurfProtection);

app.use(flash());              //initialize flash middleware
//======================================Middlewares==================================

app.use((req, res, next) => {                   // middleware for rendered views
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});


app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    })
})
// 


app.use('/admin', adminRoutes);              //'hidden' middleware for admin.ejs

app.use(shopRoutes);                            //middleware for shop.ejs
app.use(AuthRouter);



app.use('/500', errorController.get500);
app.use(errorController.prob);


app.use((error, req, res, next) => {           // special type of middleware
  console.log(error);
  res.status(500).render('500', {
    docTitle: 'error',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn
  });
})

// =================================================================================
mongoose.connect(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log('success');
    /* https.createServer({ ket: privateKey, cert: certificate }, app). */
    app.listen(process.env.PORT || 3000);
  })
  .catch(err => {
    console.log(err);
  })

