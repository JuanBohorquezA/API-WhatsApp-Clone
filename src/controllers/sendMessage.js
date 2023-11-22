const express = require('express');
const funciones = require('../public/funciones');
const Message = require('../Schemas/chat');
const Conversation = require('../Schemas/conversacion');
const middleware = require('../middlewares/Middlewares');
const user = require('../Schemas/user');
require('dotenv').config();
const router = express.Router();


router.post('/sendMessage', middleware.verificarJWT, async (req, res) => {
    try {
        // Validaciones iniciales
        if (funciones.isNullOrEmpty(req.body.PhoneNumberSender) || funciones.isNullOrEmpty(req.body.PhoneNumberReceiver) || funciones.isNullOrEmpty(req.body.content)) {
            return res.status(400).send({ message: "Please fill all the fields", status: 400, data: null });
        }

        // Crear un nuevo mensaje
        const message = new Message({
            sender: req.body.PhoneNumberSender,
            receiver: req.body.PhoneNumberReceiver,
            content: req.body.content
        });
        // Guardar el mensaje
        await message.save();
        // Buscar si ya existe una conversación entre los dos usuarios
        const Sender = await user.findOne({ PhoneNumber: req.body.PhoneNumberSender }, { _id: 0, __v: 0,Email:0 });
        const Receiver = await user.findOne({ PhoneNumber: req.body.PhoneNumberReceiver }, { _id: 0, __v: 0,Email:0 });
        let conversation = await Conversation.findOne({
            participants: { $all: [Sender,Receiver] }
            
        });
        // Si no existe, crear una nueva conversación
        if (!conversation) {
            conversation = new Conversation({
                participants: [req.body.PhoneNumberSender, req.body.PhoneNumberReceiver],
                messages: [message._id]
            });
        } else {
            // Si existe, añadir el mensaje a la conversación existente
            conversation.messages.push(message._id);
        }

        // Guardar la conversación
        await conversation.save();

        // Respuesta exitosa
        return res.status(200).send({ message: "Mensaje enviado con éxito", status: 200, data: message });
    } catch (error) {
        // Manejo de errores
        return res.status(500).send({ message: "Internal server error", status: 500, data: error });
    }
});

module.exports = router

