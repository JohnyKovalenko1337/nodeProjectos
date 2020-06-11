const User = require('../models/user')

exports.getLogin =(req,res,next )=>{
   /*  const isLoggedIn =req.get('Cookie')
    .trim()
    .split('=')[1] === 'true'; */
    console.log(req.session.isLoggedIn);
    console.log(req.session.user);
    res.render('auth/login',{
        path: '/login',
        docTitle: 'Login',
        isAuthenticated: false
    })

}
exports.postLogin= (req,res,next)=>{
            
    User.findById('5ede4f2d46955c1d107dab58')
    .then(user => {
      req.session.user = user
      req.session.isLoggedIn = true;  
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
    })
    
   
}
exports.postLogout =(req,res,next)=>{
    req.session.destroy(()=>{
        res.redirect('/');
    });
}