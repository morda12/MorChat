const mongoose = require('mongoose');
const { Schema, model } = mongoose 
var passport = require('passport');
var LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');


const userSchema = new Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    active_conversation: {
        type: [Number]
    }
})

const User = model('User', userSchema);

createUser = (newUser) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, async (err, hash) => {
            newUser.password = hash;
            await User.create(newUser);
        });
    });
};

findUserbyUsername = function(username, callback){
    const query = {username: username};
    User.findOne(query).exec()
    .then((user) => callback(false, user))
    .catch((err) => callback(err, null))
}

comparePasswords = function (candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        callback(null, isMatch)
    });
}

// passport.use(new LocalStrategy((username, password, cb) => {
    
//     await User.findOne({ username: username}, 'password', function(err, row) {
//       if (err) { return cb(err); }
//       if (!row) { return cb(null, false, { message: 'Incorrect username or password.' }); }


module.exports = {User, createUser, findUserbyUsername, comparePasswords};