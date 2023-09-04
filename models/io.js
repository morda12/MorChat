const { getUserActiveConversation } = require('./user.js')
const { getEndOfConversation, addMessageToConversation } = require('./chat.js');

module.exports = function(io) {
    io.on('connection', (socket) => {
        console.log('a user connected');
        if(socket.request.session.passport){
          const username = socket.request.user.username
          // let username = socket.request.user.username
          // console.log(username, " : ", typeof(username))
          // socket.leave(socket.id)
          
          socket.on('active conv', (conv_friend) => {
            getUserActiveConversation(username)
            .then((activeConv) =>{
                socket.leaveAll();
                socket.removeAllListeners('chat message')
                socket.join(socket.id)
                console.log(socket.rooms)
                const convID = activeConv.find((conv) => String(conv.partner)===conv_friend).conv_ID;
                const conv_ID_s = String(convID);
                socket.join(conv_ID_s);
                console.log(socket.rooms)
                getEndOfConversation(convID)
                .then((conv) => {
                    for (const message of conv){
                    io.to(socket.id).emit('chat message', {
                        user: message.writer, 
                        msg: message.text
                      });
                    }
                })
                socket.on('chat message', (msg) => {
                    message = {
                        user: username, 
                        msg: msg
                      }
                    addMessageToConversation(convID, message)
                    .then(()=>{
                        io.to(conv_ID_s).emit('chat message', message);
                    })
                    .catch((err) =>{
                    })
                    console.log('on')
                  });
            })
      
          })
        }
      });
}
