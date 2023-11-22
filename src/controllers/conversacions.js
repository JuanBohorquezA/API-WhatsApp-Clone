const express = require('express');
const funciones = require('../public/funciones');
const Conversation = require('../Schemas/conversacion');
const userSchema = require('../Schemas/user');
const middleware = require('../middlewares/Middlewares');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
require('dotenv').config();
const router = express.Router();


router.get('/getConversations', middleware.verificarJWT, async (req, res) => {
    try {
        if (funciones.isNullOrEmpty(req.query.PhoneNumber)) {
            return res.status(400).send({ message: "Please fill all the fields", status: 400, data: null });
        }
        const conversations = await Conversation.find({ participants: req.query.PhoneNumber })
            .populate('messages')
            .exec();
            let allConversations = [];

            for (const conversation of conversations) {
                const participantDetails = await Promise.all(
                    conversation.participants.map(phoneNumber =>
                        userSchema.findOne({ PhoneNumber: phoneNumber }, { Name: 1, Photo: 1, _id: 0 })
                    )
                );
    
                // Identificar si la conversación ya existe en allConversations
                let existingConversation = allConversations.find(c =>
                    c.participants.every(p => conversation.participants.includes(p)) &&
                    c.participants.length === conversation.participants.length
                );
    
                if (existingConversation) {
                    // Si existe, agrupar los mensajes
                    existingConversation.messages = [...existingConversation.messages, ...conversation.messages];
                } else {
                    // Si no, agregar la conversación actual
                    allConversations.push({
                        ...conversation.toObject(),
                        participantDetails
                    });
                }
            }
    
            return res.status(200).send({ message: "Success", status: 200, data: allConversations });
    } catch (error) {
        // Manejo de errores
        return res.status(500).send({ message: "Internal server error", status: 500, data: error });
    }
});
router.get('/availableUsers', middleware.verificarJWT, async (req, res) => {
    try {
        // Obtener el ID del usuario actual
        if (funciones.isNullOrEmpty(req.query.PhoneNumber)) {
            return res.status(400).send({ message: "Please fill all the fields", status: 400, data: null });
        }

        const users = await userSchema.find({PhoneNumber: { $ne: req.query.PhoneNumber}}, { __v: 0 }); // Ejemplo para excluir al usuario actual

        // Devuelve la lista de usuarios
        return res.status(200).send({ message: "Usuarios disponibles", status: 200, data: users });
    } catch (error) {
        // Manejo de errores
        return res.status(500).send({ message: "Internal server error", status: 500, data: error });
    }
});
router.get('/getUserData', middleware.verificarJWT, async (req, res) =>{
    try{
        if(funciones.isNullOrEmpty(req.query.PhoneNumber)){
            return res.status(400).send({ message: "Please fill all the fields", status: 400, data: null });
        }
        const user = await userSchema.findOne({PhoneNumber: req.query.PhoneNumber}, { _id: 0, __v: 0 });
        
    
        return res.status(200).send({ message: "Success", status: 200, data: user });
    }
    catch(error){
        return res.status(500).send({ message: "Internal server error", status: 500, data: error });
    }
})
router.get('/getMessagesBetweenUsers', middleware.verificarJWT, async (req, res) => {
    try {
        const { userPhoneNumber1, userPhoneNumber2 } = req.query;

        if (funciones.isNullOrEmpty(userPhoneNumber1) || funciones.isNullOrEmpty(userPhoneNumber2)) {
            return res.status(400).send({ message: "Please provide both user phone numbers", status: 400, data: null });
        }

        const conversation = await Conversation.find({
            participants: { $all: [userPhoneNumber1, userPhoneNumber2] }
        }).populate('messages').exec(); // Aquí se asume que "messages" es una referencia a otro modelo

        if (!conversation) {
            return res.status(404).send({ message: "Conversation not found", status: 404, data: null });
        }

        // Devolver los mensajes de la conversación específica
        return res.status(200).send({ message: "Success", status: 200, data: conversation });
    } catch (error) {
        // Manejo de errores
        return res.status(500).send({ message: "Internal server error", status: 500, data: error });
    }
});




module.exports = router