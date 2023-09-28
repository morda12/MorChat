const express = require('express');
const router = express.Router();
const { getUserActiveConversation, connectUsersToConversation } = require('../models/user.js')
const { Conversation, createConversation, deleteConversation, getConversationsByLastUpdated } = require('../models/chat.js');
const flash = require('flash');

/* chat page */
router.get('/', ensureAuthehenticated, (req, res, next) => {
    getUserActiveConversation(req.user.username) // Loads the user's conversation list
        .then((active_conversation) => {
            getConversationsByLastUpdated(active_conversation.map((conv)=>conv.conv_ID))
            .then((sortedIDs) => {
                const sorted_active_conv = active_conversation.sort((a,b) => sortedIDs[a.conv_ID] - sortedIDs[b.conv_ID])
                res.render('chat', {
                    page: 'chat',
                    title: 'chat',
                    username: req.user.username,
                    active_conversation: sorted_active_conv.map((conv) => conv.partner)
                });
            })

        })

});

function ensureAuthehenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

/* new conversation and connection between users */
router.post('/newDialogue', addNewConversation, (req, res) => {
    res.redirect('/chat');
})


// handle new conversation (dialogue) and connection between users
function addNewConversation(req, res, next) {
    if (req.isAuthenticated()) {
        const friends = [req.body.friendUsername, req.user.username]
        createConversation({
            conv_name: req.conv_name,
            conv_type: 'dialogue',
            conv_friends: friends
        })
            .then((convID) => {
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
            });
    }
}



module.exports = router;