import {Router} from 'express';
import EventService from './../services/event-service.js';

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
})

export default router; 