exports.getLogin =(req,res,next )=>{
    res.render('auth/login',{
        path: '/login',
        docTitle: 'Login',
    })

}