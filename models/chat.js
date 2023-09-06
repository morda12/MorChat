const mongoose = require('mongoose');
const { Schema, model } = mongoose

const chatSchema = new Schema({
    writer: {
        type: String,
        require: true
    },
    text: {
        type: String,
        require: true
    }
})

const conversationSchema = new Schema({
    conv_id: {
        type: Number,
        require: true,
        index: true
    },
    conv_name: {
        type: String,
        require: true
    },
    conv_friends: {
        type: [String],
        require: true
    },
    conv_type: {
        type: String,
        default: "dialogue"
    },
    conv_text: [chatSchema]
}, {
    timestamps: true
})

const Conversation = model('Conversation', conversationSchema);

// Create new conversation in DB
createConversation = function (conv) {
    return new Promise((resolve, reject) => {
        Conversation.findOne({}).sort({conv_id: -1}) // find the next conversation_ID
        .then((res) => {
            const new_conv_id = res.conv_id + 1;
            conv.conv_id = new_conv_id;
            Conversation.create(conv) // create new conversation
            .then((res)=>{ resolve(new_conv_id) })
            .catch((err) => { reject(err) });
        })
        .catch((err) => { reject(err) })
    })
}
// Delete the conversation from the DB
deleteConversation = function (conv) {
    Conversation.deleteOne({conv_id: conv}).exec();
}

// Sort conversations from ID list by lastUpdated
sortConversationsByLastUpdated = function (ID_list) {
    return new Promise((resolve, reject) => {
        Conversation.find({ conv_id: { $in: ID_list } }, 'conv_id').sort({'updatedAt': -1}).exec()
        .then((convs) =>{
            let newID_list=[];
            for (const conv of convs) {
                newID_list.push(conv.conv_id)
              }
            resolve(newID_list, null);
        })
        .catch((res) =>{ reject(null,res) })
    })
}

// Get the last 12 messgase from a conversations
getEndOfConversation = function (Conv_ID){
    return new Promise((resolve, reject) => {
        Conversation.findOne({ conv_id: Conv_ID }, 'conv_text').sort('conv_text.updatedAt').exec()
        .then((conv) => {
            const text = conv.conv_text;
            if(text.length > 12){
                resolve(text.slice(text.length-12));
            }
            else{ resolve(text) }
        })
        .catch((err) => { reject(err) })
    })
}

// Push new message to a conversation
addMessageToConversation = function (Conv_ID, message){
    return new Promise((resolve, reject) => {
        Conversation.updateOne({ conv_id: Conv_ID }, {$push: { conv_text: { writer: message.user, text: message.msg } } } )
        .then(() => resolve())
        .catch((err) =>{reject(err)})
    })
}

module.exports = { Conversation, createConversation, deleteConversation, sortConversationsByLastUpdated, getEndOfConversation, addMessageToConversation};
