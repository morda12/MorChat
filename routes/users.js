const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local')


const mongoose = require('mongoose');
const { User, createUser, findUserbyUsername, comparePasswords } = require('../models/user.js');

router.get('/register', (req, res, next) => {
    res.render('register', {
        page: 'register',
        subject: 'register',
        name: 'TBD',
        errors: []
    });
})

router.get('/login', (req, res, next) => {
    res.render('login', {
        page: 'login',
        subject: 'login',
        name: 'TBD'
    });
})

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash('success', 'You are now logged out');
        res.redirect('/');
    });
});

router.post('/login', passport.authenticate('local', {
    failureRedirect: "/users/login",
    failureFlash: true,
}),
    (req, res) => {
        res.location('/');
        req.flash("success", "You are log in");
        res.redirect("/");
    });

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, username: user.username });
    });
});
passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

passport.use(new LocalStrategy((username, password, cb) => {

    const incorrectMessage = 'Incorrect username or password'
    findUserbyUsername(username, (err, user) => {
        if (err) {
            console.log(err);
            return cb(incorrectMessage);
        }
        if (!user) {
            return cb(null, false, { message: incorrectMessage });
        }
        comparePasswords(password, user.password, (err, isMatch) => {
            if (err) return cb(err);
            if (isMatch) {
                return cb(null, user);
            } else {
                return cb(null, false, { message: incorrectMessage });
            }
        });
    });
}));

router.post('/register',
    body('firstname').notEmpty().isLength({ min: 2, max: 100 }).withMessage('invalid first name'),
    body('lastname').notEmpty().isLength({ min: 2, max: 100 }).withMessage('invalid last name'),
    body('username').notEmpty().isLength({ min: 4, max: 20 }).withMessage('invalid username : 4 to 20 characters'),
    body('email').notEmpty().isEmail().withMessage('invalid Email'),
    body('password1').notEmpty().isLength({ max: 20 }).isStrongPassword({
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

            // const newUser = await User.create({
            //     firstname: req.body.firstname,
            //     lastname: req.body.lastname,
            //     username: req.body.username,
            //     email: req.body.email,
            //     password: req.body.password1
            // })

            createUser({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                username: req.body.username,
                email: req.body.email,
                password: req.body.password1
            })

            console.log(`create new user: ${req.body.username}`)
            res.location('/');
            req.flash('registered', `walcome ${req.body.username}, you are now registered`);
            res.redirect('/');
        } else {                        // unvalid fields of registretion
            res.render('register', {
                page: 'register',
                subject: 'register',
                name: 'TBD',
                errors: result.array()
            });

        }
    })

module.exports = router;