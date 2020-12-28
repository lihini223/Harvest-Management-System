module.exports = {
    checkAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }

        res.redirect('/users/login');
    },
    checkNotAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return res.redirect('/dashboard');
        }

        next();
    }
}