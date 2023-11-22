const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
    sender: {
        type: String, // Ahora es un String que representa el número de teléfono
        required: true
    },
    receiver: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', MessageSchema);
