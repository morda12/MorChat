const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local')
const mongoose = require('mongoose');
const { User, createUser } = require('../models/user.js');

/* login */
router.get('/login', (req, res, next) => {
    if(req.isAuthenticated()){
        res.redirect("/")
    } else{
        res.render('login', {
            page: 'login',
            title: 'login',
        });
    }

})

router.post('/login', passport.authenticate('local', {
    failureRedirect: "/users/login",
    failureFlash: true,
}),
    (req, res) => {
        res.location('/');
        req.flash("success", "You are logged in");
        res.redirect("/");
    });


/* logout */
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash('success', 'You are now logged out');
        res.redirect('/');
    });
});

/* regiser */
router.get('/register', (req, res, next) => {
    res.render('register', {
        page: 'register',
        title: 'register',
        // errors: req.flash('errors')
    });
})

router.post('/register',
    body('firstname').notEmpty().isLength({ min: 2, max: 100 }).withMessage('invalid first name'),
    body('lastname').notEmpty().isLength({ min: 2, max: 100 }).withMessage('invalid last name'),
    body('username').notEmpty().isLength({ min: 4, max: 18 }).withMessage('invalid username : 4 to 18 characters'),
    body('email').notEmpty().isEmail().withMessage('invalid Email'),
    body('password1').notEmpty().isLength({ max: 20 }).withMessage('invalid password: please use 8 to 20 characters, at least 1 number, at least 1 symbol')
    .isStrongPassword({
        minLength: 8,
        minNumbers: 1,
        minSymbols: 1
    }).withMessage('invalid password: please use 8 to 20 characters, at least 1 number, at least 1 symbol'),
    body('password2').custom((value, { req }) => {
        if (value !== req.body.password1) {
            throw new Error('passwords are not equals');
        }
        return true
    }),
    body('username').custom(async (value, { req }) => {
        if (await User.exists({ username: value })) {
            throw new Error('This username is already in use, please choose another username');
        }
        return true
    }),
    body('email').custom(async (value, { req }) => {
        if (await User.exists({ email: value })) {
            throw new Error('Email already registered in the system');
        }
        return true
    })
    , async (req, res, next) => {
        const result = validationResult(req);
        if (result.isEmpty()) {         // all fields of registretion are valid
            createUser({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                username: req.body.username,
                email: req.body.email,
                password: req.body.password1
            })
            console.log(`create new user: ${req.body.username}`)
            res.location('/');
            req.flash('registered', `welcome ${req.body.username}, you are now registered`);
            res.redirect('/');
        } else {                        // unvalid fields of registretion
                // req.session.error = result.array()
                const errors = result.array().map((err) => err.msg);
                req.flash("errors", errors);
                res.redirect("/users/register");

        }
    })

module.exports = router;