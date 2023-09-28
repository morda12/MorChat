const passport = require('passport');
const LocalStrategy = require('passport-local')

function initPassport() {

    // Authentication was successful
passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, {
            id: user.id,
            username: user.username,
            active_conversation: user.active_conversation
        });
    });
});

// Authentication failed
passport.deserializeUser(function (user, cb) { 
    process.nextTick(function () {
        return cb(null, user);
    });
});

passport.use(new LocalStrategy((username, password, cb) => { 
    const incorrectMessage = 'Incorrect username or password'
    findUserbyUsername(username, (err, user) => {
        if (err) {
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


}

module.exports = {initPassport}