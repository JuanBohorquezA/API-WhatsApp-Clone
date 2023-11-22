const mongoose = require('mongoose');

const ConversationSchema = mongoose.Schema({
    participants: [{
        type: String, // Cambiado para referenciar números de teléfono
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId, // Los mensajes siguen referenciando ObjectIds
        ref: 'Message'
    }]
});

module.exports = mongoose.model('Conversation', ConversationSchema);
