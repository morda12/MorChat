const mongoose = require('mongoose');
const { Schema, model } = mongoose
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

// Create new user in db
createUser = (newUser) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, async (err, hash) => {
            newUser.password = hash;
            await User.create(newUser);
        });
    });
};

// Find one user by is unique username
findUserbyUsername = function (username, callback) {
    const query = { username: username };
    User.findOne(query).exec()
        .then((user) => callback(false, user))
        .catch((err) => callback(err, null))
}
// Compare between password to hash password
comparePasswords = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        callback(null, isMatch)
    });
}

// Create DB connection between users to chat conversation
connectUsersToConversation = function (usersName, conversation_ID) {
    return new Promise((resolve, reject) => {
        usersExist(usersName) // Check existence of the users
            .then(() => {
                usersAlreadyChat(usersName) // Check if the users are already linked in another conversation
                    .then(() => {
                        updateUsersActiveConversation(usersName, conversation_ID) // Create the connection of the users to the conversation
                            .then(() => { resolve(conversation_ID) })
                            .catch(() => { reject(conversation_ID) })
                    })
                    .catch(() => { reject(conversation_ID) })
            })
            .catch(() => { reject(conversation_ID) })
    })
}

// Check existence of the users
usersExist = function (usersName) {
    return new Promise((resolve, reject) => {
        User.find({ username: { $in: usersName } }).count()
            .then((count) => {
                if (count === usersName.length) { resolve() }
                else { reject() }
            })
            .catch((err) => { reject(err) })
    })
}

// Check if the users are already linked in another conversation
usersAlreadyChat = async function (usersName) {
    return new Promise(async (resolve, reject) => {
        await User.find({ username: { $in: usersName } })
            .then(async (users) => {

    const users_conv_IDs = users.flatMap((user) => user.active_conversation.map(({conv_ID}) => conv_ID))

                if (users_conv_IDs.length === new Set(users_conv_IDs).size) { resolve() }
                else { reject() }
            })
            .catch((user) => { reject() })
    })
}

// Create the connection of the users to the conversation
updateUsersActiveConversation = async function (usersName, conversation_ID) {
    return new Promise(async (resolve, reject) => {
        const bulk = await updateUsersActiveConversationBulk(usersName, conversation_ID)
        await User.bulkWrite(bulk)
            .then((result) => {
                if(result.matchedCount===usersName.length){ resolve() }
                else{ reject() }
            })
            .catch((err) => { reject() })
    })
}


// get the updated list of User Conversations
async function getUserActiveConversation(username) {
    return new Promise((resolve, reject) => {
        User.findOne({ username: username })
            .then((user) => {
                resolve(user.active_conversation)
            })
    })
}

// Creating a bulk to update connection of users to the conversation
updateUsersActiveConversationBulk = function (usersName, conversation_ID) {
    let bulk =[{
        updateOne: {
            filter: { username: usersName[0] },
            update: { $push: { active_conversation: { conv_ID: conversation_ID, partner: usersName[1] } } }
        }},
        {updateOne: {
            filter: { username: usersName[1] },
            update: { $push: { active_conversation: { conv_ID: conversation_ID, partner: usersName[0] } } }
        }}
    ]
return bulk
}


module.exports = { User, createUser, findUserbyUsername, comparePasswords, connectUsersToConversation, getUserActiveConversation };