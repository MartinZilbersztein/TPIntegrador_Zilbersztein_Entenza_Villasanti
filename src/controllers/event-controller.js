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
router.post('/', async(req,res)=>{//agregar evento
    const {name, description, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance} = req.body;
    const secretKey = process.env.SECRET_KEY;
    let payloadOriginal = null, token, mensaje = "", success = true;
    const bearerHeader = req.headers['authorization'];
    const fechaUsar = new Date(start_date).getTime();
    if (typeof bearerHeader !== 'undefined') 
    {
       const bearer = bearerHeader.split(' ');
       token = bearer[1];
    }
    try{
        payloadOriginal = jwt.verify(token, secretKey);
        if (payloadOriginal.id){
            if (name.length < 3 || description.length < 3) mensaje = res.status(400).send("El nombre y la descripción deben tener al menos tres letras");
            let maxAssistanceLugar = await svc.maxAssistanceLugar(id_event_location); 
            if (maxAssistanceLugar.length == 0) mensaje = res.status(400).send("No existe el lugar mencionado");
            else 
            {
                maxAssistanceLugar = (maxAssistanceLugar[0].max_capacity);
                if (maxAssistanceLugar < max_assistance) mensaje = res.status(400).send("La capacidad excede el máximo");
            }
            if (fechaUsar >= Date.now()) mensaje = res.status(400).send("La fecha no puede ser posterior o la misma que la acutal");
            if (price < 0) mensaje = res.status(400).send("El precio no puede ser menor a 0")
            if (!mensaje)
            {
               const array = svc.anadirEvento(name,description,id_event_location,start_date,duration_in_minutes,price,enabled_for_enrollment,max_assistance,payloadOriginal.id); 
            }
        }
    }
    catch(error){
        console.log(error);
    }
    return mensaje;
});

export default router; 