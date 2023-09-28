const express = require('express');
const { param } = require('express-validator');
const router = express.Router();
const flash = require('connect-flash');

router.get('/',(req, res, next) => {
    res.render('index', {
        page: 'home',
        title: 'home',
    });
});

router.get('/about', (req, res, next) => {
    res.render('index', {
        page: 'about',
        title: 'about',
    });
});

router.get('/contact', (req, res, next) => {
    res.render('index', {
        page: 'contact',
        title: 'contact',
    });
});


module.exports = router;