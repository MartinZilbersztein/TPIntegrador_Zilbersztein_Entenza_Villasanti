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
    if (!bearerHeader) {
        return res.status(401).send( "No se encuentra autenticado" );
    }
    try {
        token = bearerHeader.split(' ')[1];
        payloadOriginal = jwt.verify(token, secretKey);
    } catch (err) {
        return res.status(401).send( "El token no es válido" );
    }
    try{
        if (payloadOriginal.id){
            if (name.length < 3 || description.length < 3) mensaje = res.status(400).send("El nombre y la descripción deben tener al menos tres letras");
            let maxAssistanceLugar = await svc.maxAssistanceLugar(id_event_location); 
            if (maxAssistanceLugar.length == 0) mensaje = res.status(400).send("No existe el lugar mencionado");
            else 
            {
                maxAssistanceLugar = (maxAssistanceLugar[0].max_capacity);
                if (maxAssistanceLugar < max_assistance) mensaje = res.status(400).send("La capacidad excede el máximo");
            }
            if (fechaUsar <= Date.now()) mensaje = res.status(400).send("La fecha no puede ser anterior o la misma que la actual");
            if (duration_in_minutes <= 0) mensaje = res.status(400).send("La duración no puede ser menor o igual a 0");
            if (price < 0) mensaje = res.status(400).send("El precio no puede ser menor a 0")
            if (!mensaje)
            {
               const array = svc.anadirEvento(name,description,id_event_location,start_date,duration_in_minutes,price,enabled_for_enrollment,max_assistance,payloadOriginal.id); 
                if (array) {
                    mensaje = res.status(201).send("Creado");
                }
            }
        }
    }
    catch(error){
        console.log(error);
    }
    return mensaje;
});
router.put('/', async(req,res)=>{//modificar evento
    const body = req.body;
    const secretKey = process.env.SECRET_KEY;
    let payloadOriginal = null, token, mensaje = "", success = true;
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
    try{
        if (payloadOriginal.id){
            const evento = await svc.getAllASyncById(body.id);
            if(evento.length != 0){
                Object.keys(body).forEach(function (key,index) {
                    if(body[key] != null) evento[0].event[key] = body[key];
                });
                const {name, description, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id} = evento[0].event;
                const fechaUsar = new Date(start_date).getTime();
                if (name.length < 3 || description.length < 3) mensaje = res.status(400).send("El nombre y la descripción deben tener al menos tres letras");
                let maxAssistanceLugar = await svc.maxAssistanceLugar(id_event_location); 
                if (maxAssistanceLugar.length == 0) mensaje = res.status(400).send("No existe el lugar mencionado");
                else 
                {
                    maxAssistanceLugar = (maxAssistanceLugar[0].max_capacity);
                    if (maxAssistanceLugar < max_assistance) mensaje = res.status(400).send("La capacidad excede el máximo");
                }
                if (fechaUsar <= Date.now()) mensaje = res.status(400).send("La fecha no puede ser anterior o la misma que la actual");
                if (duration_in_minutes <= 0) mensaje = res.status(400).send("La duración no puede ser menor o igual a 0");
                if (price < 0) mensaje = res.status(400).send("El precio no puede ser menor a 0")
                if (!mensaje)
                {
                    const array = svc.modificarEvento(name,description,id_event_location,start_date,duration_in_minutes,price,enabled_for_enrollment,max_assistance,id); 
                    if (array) {
                        mensaje = res.status(200).send("OK");
                    }
                }
            }
            else mensaje = res.status(404).send("Evento no existe");
        }
    }
    catch(error){
        console.log(error);
    }
    return mensaje;
});
router.delete('/:id', async(req,res)=>{//eliminar evento
    const id = req.params.id;
    const secretKey = process.env.SECRET_KEY;
    let payloadOriginal = null, token, mensaje = "", success = true;
    const bearerHeader = req.headers['authorization'];
    let result;
    if (!bearerHeader) {
        return res.status(401).send( "No se encuentra autenticado" );
    }
    try {
        token = bearerHeader.split(' ')[1];
        payloadOriginal = jwt.verify(token, secretKey);
    } catch (err) {
        return res.status(401).send( "El token no es válido" );
    }
    try {
        if(payloadOriginal.id){
            result = await svc.eliminarEvento(id);
            if (result) mensaje = res.status(200).send("OK");
        }
    } catch (error) {
        console.log(error);
    }
    return mensaje;
});
router.post('/:id/enrollment', async (req, res) => {
    const eventId = req.params.id;
    const bearerHeader = req.headers['authorization'];
    const secretKey = process.env.SECRET_KEY;
    let payloadOriginal;
    let token;
    if (!bearerHeader) {
        return res.status(401).send( "No se encuentra autenticado" );
    }
    try {
        token = bearerHeader.split(' ')[1];
        payloadOriginal = jwt.verify(token, secretKey);
    } catch (err) {
        return res.status(401).send( "El token no es válido" );
    }
    if (payloadOriginal.id){
        const eventArr = await svc.getAllASyncById(eventId);
        if (!eventArr || eventArr.length === 0) {
            return res.status(404).send( "El evento no fue encontrado" );
        }
        const event = eventArr[0].event;

        if (!event.enabled_for_enrollment) {
            return res.status(400).send( "No está habilitada la inscripción" );
        }

        let eventDate = new Date(event.start_date);
        const now = new Date();
        if(
            eventDate <= now ||
            (eventDate.getFullYear() === now.getFullYear() &&
            eventDate.getMonth() === now.getMonth() &&
            eventDate.getDate() === now.getDate())
        ) {
            return res.status(400).json({ success: false, mensaje: "No se puede registrar a un evento pasado o que es hoy" });
        }

        const enrolledCount = await svc.countEnrollments(eventId);
        if (enrolledCount >= event.max_assistance) {
            return res.status(400).send( "Este evento ya se encuentra en su capacidad máxima" );
        }

        const alreadyEnrolled = await svc.isUserEnrolled(payloadOriginal.id, eventId);
        if (alreadyEnrolled) {
            return res.status(400).send( "El usuario ya está registrado en el evento" );
        }

        const registrationDate = new Date().toISOString().split('T')[0];
        await svc.enrollUser(payloadOriginal.id, eventId, registrationDate);
    }
    return res.status(201).send( "Inscripción exitosa" );
});

router.delete('/:id/enrollment', async (req, res) => {
    const eventId = req.params.id;
    const bearerHeader = req.headers['authorization'];
    const secretKey = process.env.SECRET_KEY;
    let token, payload;

    if (!bearerHeader) {
        return res.status(401).send( "No se encuentra autenticado" );
    }
    try {
        token = bearerHeader.split(' ')[1];
        payload = jwt.verify(token, secretKey);
    } catch (err) {
        return res.status(401).send( "El token no es válido" );
    }

    const eventArr = await svc.getAllASyncById(eventId);
    if (!eventArr || eventArr.length === 0) {
        return res.status(404).send( "El evento no fue encontrado" );
    }
    const event = eventArr[0].event;

    const alreadyEnrolled = await svc.isUserEnrolled(payload.id, eventId);
    if (!alreadyEnrolled) {
        return res.status(400).send( "No se encuentra registrado en el evento" );
    }

    const eventDate = new Date(event.start_date);
    const now = new Date();
    if (
        eventDate <= now ||
        (eventDate.getFullYear() === now.getFullYear() &&
         eventDate.getMonth() === now.getMonth() &&
         eventDate.getDate() === now.getDate())
    ) {
        return res.status(400).send( "No se puede eliminar de un evento pasado o que es hoy" );
    }

    await svc.unenrollUser(payload.id, eventId);

    return res.status(200).send( "Se eliminó exitosamente" );
});

export default router;