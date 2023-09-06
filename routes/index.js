const express = require('express');
const { param } = require('express-validator');
const router = express.Router();
const flash = require('connect-flash');

router.get('/',(req, res, next) => {
    res.render('index', {
        page: 'home',
        subject: 'home',
    });
});

router.get('/about', (req, res, next) => {
    res.render('index', {
        page: 'about',
        subject: 'about',
    });
});

router.get('/contact', (req, res, next) => {
    res.render('index', {
        page: 'contact',
        subject: 'contact',
    });
});


module.exports = router;