import {Router} from 'express';
import EventService from './../services/event-service.js';
import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';

const router = Router();
const svc = new EventService();

router.get('/', async(req,res)=>{
    let respuesta;
    let {name, start_date} = req.query;
    const returnArray = await svc.getAllASync({name, start_date});
    if (returnArray)
    {
        respuesta = res.status(200).json(returnArray);
    }
    else {
        respuesta = res.status(500).send("Error interno");
    }
    return respuesta;
});
router.get('/:id', async(req,res)=>{
    let id = req.params.id;
    let respuesta;
    const returnArray = await svc.getAllASyncById(id);
    if (returnArray)
    {
        respuesta = res.status(200).json(returnArray);
    }
    else {
        respuesta = res.status(500).send("Error interno");
    }
    return respuesta;
});
router.post('/', async(req,res)=>{
    let respuesta;
    let {name, description, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user} = req.query;
});
router.post('/api/event', async(req,res)=>{
    const {name, description, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance} = req.body;
    const secretKey = process.env.SECRET_KEY;
    let payloadOriginal = null;
    try{
        payloadOriginal = jwt.verify(token, secretKey);
    }
    catch(error){
        console.log(error);
    }

})

export default router; 