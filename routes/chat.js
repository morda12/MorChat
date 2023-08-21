const express = require('express');
const { username } = require('react-lorem-ipsum');
const router = express.Router();


router.get('/', ensureAuthehenticated, (req, res, next) => {
    console.log(req.user)
    res.render('chat', {
        page: 'chat',
        subject: 'chat',
        username: req.user.username,
        active_conversation: req.user.active_conversation
    });
});


function ensureAuthehenticated(req,res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}



module.exports = router;