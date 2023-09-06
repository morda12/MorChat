const express = require('express');
const router = express.Router();
const { getUserActiveConversation, connectUsersToConversation } = require('../models/user.js')
const { Conversation, createConversation, deleteConversation, sortConversationsByLastUpdated } = require('../models/chat.js');
const flash = require('flash');

/* chat page */
router.get('/', ensureAuthehenticated, (req, res, next) => {
    getUserActiveConversation(req.user.username) // Loads the user's conversation list
    .then((active_conversation) =>{
        sortConversations(active_conversation)
        .then((convIDs)=>{
            let sorted_active_conversation = []
            for (const ID of convIDs) {
                sorted_active_conversation.push(active_conversation.find(conv => conv.conv_ID === ID).partner)
            }
            res.render('chat', {
                page: 'chat',
                subject: 'chat',
                username: req.user.username,
                active_conversation: sorted_active_conversation
            });
        })
        .catch((err)=>{})
    })

});

function ensureAuthehenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

// sort array of conversations by last update
function sortConversations(active_conversation){
    return new Promise(async (resolve, reject) => {
        let convID = []
        for (const conv of active_conversation) {
            convID.push(conv.conv_ID);
        }
        sortConversationsByLastUpdated(convID)
        .then((sorted_ConvID) => { resolve(sorted_ConvID) })
        .catch((err) =>{ reject(err) })
    });
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