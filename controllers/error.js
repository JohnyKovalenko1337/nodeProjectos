exports.prob = (req,res,next) => {
    res.status(404).render('404', {
        docTitle:'error',
        path:'404',
        isAuthenticated: req.session.isLoggedIn
    }); 
}

exports.get500 = (req,res,next) => {
    res.status(500).render('500', {
        docTitle:'error',
        path:'500',
        isAuthenticated: req.session.isLoggedIn
    }); 
}