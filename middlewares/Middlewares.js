const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();
class Middleware{
    static ValuetokenSignUp(req, res, next){
        const tokenEnviado = req.headers.authorization;
        const TokenEsperado = process.env.IdentificadorSignUp
        if(!tokenEnviado){
            return res.status(401).send({message:'No se proporcionó el Bearer token', status: 401, data: null});
        }
        const token  = tokenEnviado.startsWith('Bearer ') ? tokenEnviado.slice(7) : tokenEnviado;
        if(token !== TokenEsperado){
            return res.status(401).send({message:'Token invalido', status: 401, data: null});
        }
        next();
    }
    static ValuetokenLogin(req, res, next){
        const tokenEnviado = req.headers.authorization;
        const TokenEsperado = process.env.IdentificadorLogin
        if(!tokenEnviado){
            return res.status(401).send({message:'No se proporcionó el Bearer token', status: 401, data: null});
        }
        const token  = tokenEnviado.startsWith('Bearer ') ? tokenEnviado.slice(7) : tokenEnviado;
        if(token !== TokenEsperado){
            return res.status(401).send({message:'Token invalido', status: 401, data: null});
        }
        next();
    }
    static verificarJWT(req, res, next) {
        const token = req.headers.authorization;
    
        if (!token) {
            return res.status(401).send({ message: 'Unauthorized.', status: 401, data: null });
        }
    
        try {
            const tokenLimpio = token.startsWith('Bearer ') ? token.slice(7) : token;
    
            const decoded = jwt.verify(tokenLimpio, process.env.JWT_SECRET);
            req.usuario = decoded; 
            next(); 
        } catch (error) {
            res.status(400).send({ message: 'Invalid token.', status: 400, data: null });
        }
    }
}
module.exports = Middleware