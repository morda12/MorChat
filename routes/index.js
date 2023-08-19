const express = require('express');
const { param } = require('express-validator');
const router = express.Router();
const flash = require('connect-flash');

router.get('/',(req, res, next) => {
    res.render('index', {
        page: 'home',
        subject: 'home',
        name: 'TBD',
        login: false, //TBD
    });
});

router.get('/about', (req, res, next) => {
    res.render('index', {
        page: 'about',
        subject: 'about',
        name: 'TBD',
        login: false //TBD
    });
});

router.get('/contact', (req, res, next) => {
    res.render('index', {
        page: 'contact',
        subject: 'contact',
        name: 'TBD',
        login: false //TBD
    });
});

// router.get('/chat', ensureAuthehenticated, (req, res, next) => {
//     res.render('chat', {
//         page: 'contact',
//         subject: 'contact',
//         name: 'TBD',
//         login: false //TBD
//     });
// });

// function ensureAuthehenticated(req,res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect('/');
// }

module.exports = router;