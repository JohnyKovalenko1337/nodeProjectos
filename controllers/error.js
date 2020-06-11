exports.prob = (req,res,next) => {
    res.status(404).render('404', {docTitle:'error',path:'404',isAuthenticated: req.session.isLoggedIn}); //middleware for 404.html
}