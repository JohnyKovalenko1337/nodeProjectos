exports.prob = (req,res,next) => {
    res.status(404).render('404', {docTitle:'error',path:'404'}); //middleware for 404.html
}