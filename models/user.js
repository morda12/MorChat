const mongoose = require('mongoose');
const { Schema, model } = mongoose
var passport = require('passport');
var LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');

const activeConversationSchema = new Schema({
    conv_ID: {
        type: Number,
        require: true
    },
    partner: {
        type: String
    }
});


const userSchema = new Schema({
    username: {
        type: String,
        require: true,
        index: true
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    active_conversation: [activeConversationSchema]
});

const User = model('User', userSchema);

createUser = (newUser) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, async (err, hash) => {
            newUser.password = hash;
            await User.create(newUser);
        });
    });
};

findUserbyUsername = async function (username, callback) {
    const query = { username: username };
    await User.findOne(query).exec()
        .then((user) => callback(false, user))
        .catch((err) => callback(err, null))
}

comparePasswords = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        callback(null, isMatch)
    });
}

// create DB connection between users to chat conversation
connectUsersToConversation = async function (usersName, conversation_ID) {
    return new Promise(async (resolve, reject) => {
    usersExist(usersName)
        .then(() => {
            usersAlreadyChat(usersName)
                .then(() => {
                    updateUsersActiceConversation(usersName, conversation_ID)
                        .then(() => {
                            console.log('succsess');
                            resolve(conversation_ID);
                        })
                        .catch(() => {
                            console.log('err in : updateUsersActiceConversation');
                            reject(conversation_ID);
                        })
                })
                .catch(() => {
                    console.log('err in : usersAlreadyChat');
                    reject(conversation_ID);
                })
        })
        .catch(() => {
            console.log('err in : usersExist');
            reject(conversation_ID);
        })
    })
}

// check if all users exist
usersExist = async function (usersName) {
    return new Promise(async (resolve, reject) => {
        await User.find({ username: { $in: usersName } }).count()
            .then(async (count) => {
                if (count === usersName.length) {
                    resolve()
                }
                else {
                    reject()
                }
            })
            .catch((count) => {
                reject()
            })
    })
}

// check if users already friends
usersAlreadyChat = async function (usersName) {
    return new Promise(async (resolve, reject) => {
        await User.find({ username: { $in: usersName } })
            .then(async (users) => {
                let users_conv_IDs = []
                users.forEach((user) => {
                    user.active_conversation.forEach((conv) => {
                        users_conv_IDs.push(conv.conv_ID)
                    })
                });
                if (users_conv_IDs.length === new Set(users_conv_IDs).size) {
                    resolve()
                }
                else {
                    reject()
                }
            })
            .catch((user) => {
                reject()
            })
    })
}


updateUsersActiceConversation = async function (usersName, conversation_ID) {
    return new Promise(async (resolve, reject) => {
        await User.updateMany({ username: { $in: usersName } }, { $push: { active_conversation: { conv_ID: conversation_ID } } })
            .then((result) => {
                resolve()
            })
            .catch((user) => {
                reject()
            })
    })
}


// get the updated list of User Conversations
async function getUserActiveConversation(username) {
    return new Promise(async (resolve, reject) => {
    await User.findOne({ username: username })
        .then((user) => {
            resolve(user.active_conversation)
        })
    })
}


module.exports = { User, createUser, findUserbyUsername, comparePasswords, connectUsersToConversation, getUserActiveConversation };