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

router.post('/:id/enrollment', async (req, res) => {
    const eventId = req.params.id;
    const bearerHeader = req.headers['authorization'];
    const secretKey = process.env.SECRET_KEY;
    let token, payload;

    if (!bearerHeader) {
        return res.status(401).json({ success: false, mensaje: "No autenticado" });
    }
    try {
        token = bearerHeader.split(' ')[1];
        payload = jwt.verify(token, secretKey);
    } catch (err) {
        return res.status(401).json({ success: false, mensaje: "Token inválido" });
    }

    const eventArr = await svc.getAllASyncById(eventId);
    if (!eventArr || eventArr.length === 0) {
        return res.status(404).json({ success: false, mensaje: "Evento no encontrado" });
    }
    const event = eventArr[0].event;

    if (!event.enabled_for_enrollment) {
        return res.status(400).json({ success: false, mensaje: "El evento no está habilitado para inscripción" });
    }

    const eventDate = new Date(event.start_date);
    const now = new Date();
    if (
        eventDate <= now ||
        (eventDate.getFullYear() === now.getFullYear() &&
         eventDate.getMonth() === now.getMonth() &&
         eventDate.getDate() === now.getDate())
    ) {
        return res.status(400).json({ success: false, mensaje: "No se puede registrar a un evento pasado o que es hoy" });
    }

    const enrolledCount = await svc.countEnrollments(eventId);
    if (enrolledCount >= event.max_assistance) {
        return res.status(400).json({ success: false, mensaje: "Capacidad máxima alcanzada" });
    }

    const alreadyEnrolled = await svc.isUserEnrolled(payload.id, eventId);
    if (alreadyEnrolled) {
        return res.status(400).json({ success: false, mensaje: "El usuario ya está registrado en el evento" });
    }

    const registrationDate = new Date();
    await svc.enrollUser(payload.id, eventId, registrationDate);

    return res.status(201).json({ success: true, mensaje: "Inscripción exitosa" });
});

router.delete('/:id/enrollment', async (req, res) => {
    const eventId = req.params.id;
    const bearerHeader = req.headers['authorization'];
    const secretKey = process.env.SECRET_KEY;
    let token, payload;

    if (!bearerHeader) {
        return res.status(401).json({ success: false, mensaje: "No autenticado" });
    }
    try {
        token = bearerHeader.split(' ')[1];
        payload = jwt.verify(token, secretKey);
    } catch (err) {
        return res.status(401).json({ success: false, mensaje: "Token inválido" });
    }

    const eventArr = await svc.getAllASyncById(eventId);
    if (!eventArr || eventArr.length === 0) {
        return res.status(404).json({ success: false, mensaje: "Evento no encontrado" });
    }
    const event = eventArr[0].event;

    const alreadyEnrolled = await svc.isUserEnrolled(payload.id, eventId);
    if (!alreadyEnrolled) {
        return res.status(400).json({ success: false, mensaje: "El usuario no está registrado en el evento" });
    }

    const eventDate = new Date(event.start_date);
    const now = new Date();
    if (
        eventDate <= now ||
        (eventDate.getFullYear() === now.getFullYear() &&
         eventDate.getMonth() === now.getMonth() &&
         eventDate.getDate() === now.getDate())
    ) {
        return res.status(400).json({ success: false, mensaje: "No se puede remover de un evento pasado o que es hoy" });
    }

    await svc.unenrollUser(payload.id, eventId);

    return res.status(200).json({ success: true, mensaje: "Eliminado de la inscripción correctamente" });
});

export default router;