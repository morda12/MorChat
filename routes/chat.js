const express = require('express');
const router = express.Router();
const { getUserActiveConversation } = require('../models/user.js')

const { connectUsersToConversation } = require('../models/user.js')
const { Conversation, createConversation, deleteConversation } = require('../models/chat.js');
const flash = require('flash');

router.get('/', ensureAuthehenticated, (req, res, next) => {

    console.log(req.user.active_conversation)

    res.render('chat', {
        page: 'chat',
        subject: 'chat',
        username: req.user.username,
        active_conversation: req.user.active_conversation,
    });
});

function ensureAuthehenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

// create new conversation
router.post('/newDialogue', addNewConversation, (req, res) => {
    console.log("newDialogue");

    res.redirect('/chat');
})


//handle creation of a new conversation and connecting users to the conversation
async function addNewConversation(req, res, next) {
    if (req.isAuthenticated()) {
        const friends = [req.body.friendUsername, req.user.username]
        await createConversation({
            conv_name: req.conv_name,
            conv_type: 'dialogue'
        }, (convID) => {
            if (convID) {
                connectUsersToConversation(friends, convID)
                    .then(() => {
                        getUserActiveConversation(req.user.username)
                        .then((ac) => {
                            req.user.active_conversation = ac;
                            return next();
                        });
                    })
                    .catch((conversation_ID) => {
                        deleteConversation(conversation_ID);
                        return next();
                    })
            }
        });
    }
}


module.exports = router;