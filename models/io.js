const { getUserActiveConversation } = require('./user.js')
const { getEndOfConversation, addMessageToConversation } = require('./chat.js');

module.exports = function (io) {
  io.on('connection', (socket) => {
    checkUserIsLogin(socket) // Check that the user is logged in
      .then((username) => {
        socket.on('active conv', (conv_friend) => { // new listener 'active conv' (The conversation the user is currently viewing)
          console.log(conv_friend)
          getUserActiveConversation(username) // get the updated list of User Conversations
            .then((activeConv) => {
              const convID = activeConv.find((conv) => String(conv.partner) === conv_friend).conv_ID;
              const conv_ID_s = String(convID);
              getEndOfConversation(convID)
                .then((conv) => {
                  emitConversationHistory(io, socket, conv)
                })
              AddUserToRelevantRooms(socket, conv_ID_s)
                .then(() => {
                  socket.on('chat message', (msg) => { // new listener 'chat message'
                    const message = createMessage(msg, username)
                    addMessageToConversation(convID, message) // Update the last message in the database
                      .then(() => {
                        emitNewMessage(io, conv_ID_s, message) // emit the message to all users linked to the conversation
                      })
                      .catch((err) => { })
                  })

                })
            })

        })
      })
  })
}

// Check that the user is logged in
function checkUserIsLogin(socket) {
  return new Promise((resolve, reject) => {
    if (socket.request.session.passport.user) {
      resolve(socket.request.user.username);
    } else {
      reject();
    }
  })
}


//Add the user only to the relevant rooms
function AddUserToRelevantRooms(socket, conv_ID_s) {
  return new Promise((resolve, reject) => {
    socket.leaveAll(); //
    socket.removeAllListeners('chat message')
    socket.join(socket.id)
    socket.join(conv_ID_s);
    resolve()
  })
}

// Create new message
function createMessage(msg, writer) {
  message = {
    user: writer,
    msg: msg
  }
  return (message);
}

// Emit the message to all users linked to the conversation
function emitNewMessage(io, conv_ID_s, message) {
  io.to(conv_ID_s).emit('chat message', message)
}

// Emit the latest messages to the user
function emitConversationHistory(io, socket, conv) {
  for (const message of conv) {
    io.to(socket.id).emit('chat message', {
      user: message.writer,
      msg: message.text
    });
  }
}