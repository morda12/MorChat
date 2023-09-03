const express = require('express');
const router = express.Router();
const { getUserActiveConversation } = require('../models/user.js')

const { connectUsersToConversation } = require('../models/user.js')
const { Conversation, createConversation, deleteConversation, sortConversationsByLastUpdated } = require('../models/chat.js');
const flash = require('flash');

router.get('/', ensureAuthehenticated, (req, res, next) => {

    // console.log(req.socket)

    // res.render('chat', {
    //     page: 'chat',
    //     subject: 'chat',
    //     username: req.user.username,
    //     active_conversation: []
    // });
    getUserActiveConversation(req.user.username)
    .then((active_conversation) =>{
        sortConversations(active_conversation)
        .then((convIDs)=>{
            // connectSocketRoom(req.socket, convIDs)
            let sorted_active_conversation = []
            for (const ID of convIDs) {
                sorted_active_conversation.push(active_conversation.find(conv => conv.conv_ID === ID).partner)
            }
            console.log(sorted_active_conversation);
            res.render('chat', {
                page: 'chat',
                subject: 'chat',
                username: req.user.username,
                active_conversation: sorted_active_conversation
            });
            req.io.emit('')
        })
        .catch(()=>{
    
        })
    })

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
            conv_type: 'dialogue',
            conv_friends: friends
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

function sortConversations(active_conversation){
    return new Promise(async (resolve, reject) => {
        let convID = []
        for (const conv of active_conversation) {
            convID.push(conv.conv_ID);
        }
        sortConversationsByLastUpdated(convID)
        .then((sorted_ConvID) => {
            resolve(sorted_ConvID)
        })
        .catch((err) =>{
            reject(err)
        })
    });
}

function connectSocketRoom(socket, conversationID){
    io.on('connection', (socket) => {
        console.log('connect');
        //   console.log(`a user connected to chat: ${socket}`);
        
          socket.on('disconnect', () => {
            console.log('user disconnected');
        
            socket.on('send message', (conversation, message) => {
              socket.emit('new message', {
                conversation: conversation,
                message: message
              });
            })
          });
        });
    // io.socket.on("private message", ({ content, to }) => {
    //     socket.to(to).emit("private message", {
    //       content,
    //       from: socket.id,
    //     });
    //   });
}

function messageHandler(req) {
req.io.emit('msg', 'new msg')
}



module.exports = router;