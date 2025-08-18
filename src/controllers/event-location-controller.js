import {Router} from 'express';
import EventLocationService from './../services/event-location-service.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config'
import { configDotenv } from 'dotenv';

const router = Router();
const svc = new EventLocationService();

router.get('/', async(req,res)=>{
    const secretKey = process.env.SECRET_KEY;
    let payloadOriginal = null, token;
    const bearerHeader = req.headers['authorization'];
    if (!bearerHeader) {
        return res.status(401).send( "No se encuentra autenticado" );
    }
    try {
        token = bearerHeader.split(' ')[1];
        payloadOriginal = jwt.verify(token, secretKey);
    } catch (err) {
        return res.status(401).send( "El token no es válido" );
    }
    const eventLocations = await svc.getAll(payloadOriginal.id);
    return res.status(200).json(eventLocations);
});
export default router;