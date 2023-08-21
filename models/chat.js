const mongoose = require('mongoose');
const { Schema, model } = mongoose 

const chatSchema = new Schema({
    writer:{
        type: String
    },
    text:{
        type: String
    },
    time:{
        type: String
    }
})

const conversationSchema = new Schema({
    conv_id: {
        type: Number,
        index: true
    },
    conv_name: {
        type: String
    },
    conv_type:{
        type: String
    },
    conv_text: chatSchema
})