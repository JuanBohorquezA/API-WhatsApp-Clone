const express = require('express');
const userSchema = require('../Schemas/user');
const funciones = require('../public/funciones');
const middleware = require('../middlewares/Middlewares');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const router = express.Router();


router.post('/signUp', middleware.ValuetokenSignUp, async(req, res) => {
    try{
      if(funciones.isNullOrEmpty(req.body.PhoneNumber) || funciones.isNullOrEmpty(req.body.Name) ||funciones.isNullOrEmpty(req.body.Email) || funciones.isNullOrEmpty(req.body.Photo)){
         return res.status(400).send({message: "Please fill all the fields", status: 400, data: null}); 
      }
      if(await ExistUser(req.body.PhoneNumber)){
         return res.status(400).send({message: "Phone number already exists", status: 400, data: null});
      }
      const newUser = new userSchema(req.body);
      await newUser.save();
      return res.status(200).send({message: "User created", status: 200, data: null});
    }catch(error){
      return res.status(500).send({message: "Internal server error", status: 500, data: error});
    }
});
router.post('/Login', middleware.ValuetokenLogin, async(req, res) => {
  try{
    if(funciones.isNullOrEmpty(req.body.PhoneNumber)){
       return res.status(400).send({message: "Please fill all the fields", status: 400, data: null}); 
    }
    if(!await ValidUser(req.body.PhoneNumber)){
       return res.status(400).send({message: "Phone number does not exist", status: 400, data: null}); 
    }
    const token = await generarJWT(req.body.PhoneNumber);
    return res.status(200).send({message: "User Logged", status: 200, data: token});
  }catch(error){
    return res.status(500).send({message: "Internal server error", status: 500, data: error});
  }
});

const generarJWT= async(usuarioData) => {
    const secretKey = process.env.JWT_SECRET; 
    const opciones = {
        expiresIn: '24h' 
    };

    const token = jwt.sign({ data: usuarioData }, secretKey, opciones);
    return token;
}
const ValidUser = async(phone) => {
    const user = await userSchema.findOne({ PhoneNumber: phone });
    if(!user){
        return false;
    }
    return true;
}
const ExistUser = async(phone) => {
    const user = await userSchema.findOne({ PhoneNumber: phone });
    if(!user){
        return false;
    }
    return true;
}
module.exports = router
