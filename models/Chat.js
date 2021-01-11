const mongoose = require('mongoose');

const ChatSchema = mongoose.Schema({
    nic: {
        type: String,
        required: true
    },
    messages: {
        type: Array,
        default: []
    }
});

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;