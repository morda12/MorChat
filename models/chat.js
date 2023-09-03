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
}, {
    time_stamp: true
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
})

const Conversation = model('Conversation', conversationSchema);

// create new conversation in DB
createConversation = async function (conv, cb) {
    // find the next conversation_ID
    await Conversation.findOne({}).sort({conv_id: -1})
        .then(async (res) => {
            const new_conv_id = res.conv_id + 1;
            conv.conv_id = new_conv_id;
            // create new conversation
            await Conversation.create(conv)
            .then((res)=>{})
            .catch((err) => {
                console.log(err)
                return(null)
            });
            cb(new_conv_id)  // TBD - this line need to move up inside ".then"
        })
        .catch((err) => {
            return(null)
        })
}

deleteConversation = function (conv) {
    console.log(conv)
    Conversation.deleteOne({conv_id: conv}).exec();
}

sortConversationsByLastUpdated = async function (ID_list) {
    return new Promise(async (resolve, reject) => {
        await Conversation.find({ conv_id: { $in: ID_list } }, 'conv_id').sort('conv_text.updatedAt').exec()
        .then((convs) =>{
            let newID_list=[]
            for (const conv of convs) {
                newID_list.push(conv.conv_id)
              }
            resolve(newID_list, null);
        })
        .catch((res) =>{
            reject(null,res);
        })
    })
}

module.exports = { Conversation, createConversation, deleteConversation, sortConversationsByLastUpdated};
