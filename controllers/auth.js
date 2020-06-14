const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');


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

exports.postReset = (req,res,next)=>{
    crypto.randomBytes(32, (err,buffer)=>{
        if(err){
            console.log(err,'errorich');
            console.log('322');
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');       //param hex to convert to normal text
        User.findOne({email: req.body.email,})
        .then((user)=>{
            if(!user){
                req.flash('error', 'No account with that email found');
                return res.redirect('/reset');
            }
            user.resetToken = token;
            user.resetTokenExperation = Date.now() + 3600000;
            return user.save();  
        })
        .then(()=>{
            console.log(token);
            res.redirect('/reset/'+token);
        })
        .catch(err=>{
            console.log(err);
        })
    })
}

exports.getNewPassword = (req,res,next)=>{
    const token = req.params.token;
    User.findOne({resetToken: token, resetTokenExperation:{$gt: Date.now()}})
    .then((user)=>{
        let message = req.flash('error', );           //check if message exist
        if( message.length > 0){
            message = message[0];
        }
        else{
            message = null;             // if not exist we pass null instead of empty array
        }
        res.render('auth/new-password',{
            path: '/new-password',
            docTitle: 'New Password',
            errorMessage: message,     //pulling error message
            userId: user._id.toString(),
            passwordToken: token
        })
    })
    .catch(err=>{
        console.log(err);
    })

    
}

exports.postNewPassword=(req,res,next)=>{
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;
    User.findOne({
        resetToken: passwordToken,
        _id: userId,
        resetTokenExperation:{$gt: Date.now()}    
    })
    .then(user=>{
        resetUser = user;
        return bcrypt.hash(newPassword, 12 );
    })
    .then(hashedPassword=>{
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExperation = undefined;
        return resetUser.save();
    })
    .then(()=>{
        res.redirect('/login');
    })
    .catch(err=>{
        console.log(err);
    })
};