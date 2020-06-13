const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin =(req,res,next )=>{
    let message = req.flash('error');           //check if message exist
    if( message.length > 0){
        message = message[0];
    }
    else{
        message = null;             // if not exist we pass null instead of empty array
    }
    res.render('auth/login',{
        path: '/login',
        docTitle: 'Login',
        errorMessage: message     //pulling error message
    })

}
exports.postLogin= (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email: email})
    .then(user => {
        if(!user){
            req.flash('error', 'Invalid email or password B)');
            return res.redirect('/login');
        }
       bcrypt.compare(password,user.password)
            .then((doMatch)=>
            {
                if(doMatch)
               { req.session.user = user
                req.session.isLoggedIn = true;  
                return req.session.save(err=>{
                    console.log(err);
                    res.redirect('/');
                });     
               }
               req.flash('error', 'Invalid email or password B)');
               res.redirect('login');
            })
            .catch(err=>{
                console.log(err);
                res.redirect('/login')
            })
      
    })
    .catch(err => {
      console.log(err);
    })
}
exports.postLogout =(req,res,next)=>{
    req.session.destroy((err)=>{
        console.log(err);
        res.redirect('/');
    });
}

exports.getSignup = (req,res,next)=>{
    let message = req.flash('error');           //check if message exist
    if( message.length > 0){
        message = message[0];
    }
    else{
        message = null;             // if not exist we pass null instead of empty array
    }
    res.render('auth/signup',{
        path: '/signup',
        docTitle: 'SignUp',
        errorMessage: message
    })
}
exports.postSignup=(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({ email: email })
      .then(userDoc => {
        if (userDoc) {
          req.flash('error', 'E-Mail exists already, please pick a different one.');
          return res.redirect('/signup');
        }
        return bcrypt
          .hash(password, 12)
          .then(hashedPassword => {
            const user = new User({
              email: email,
              password: hashedPassword,
              cart: { items: [] }
            });
            return user.save();
          })
          .then(result => {
            res.redirect('/login');
          });
      })
      .catch(err => {
        console.log(err);
      });
    
};

exports.getReset = (req,res,next)=>{
    let message = req.flash('error');           //check if message exist
    if( message.length > 0){
        message = message[0];
    }
    else{
        message = null;             // if not exist we pass null instead of empty array
    }
    res.render('auth/reset',{
        path: '/reset',
        docTitle: 'Reset',
        errorMessage: message     //pulling error message
    })
}