const express = require('express');
const router = express.Router();

router.get('/', ensureAuthehenticated, (req, res, next) => {
    res.render('chat', {
        page: 'chat',
        subject: 'chat',
        name: 'TBD',
    });
});

function ensureAuthehenticated(req,res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

module.exports = router;