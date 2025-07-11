import {Router} from 'express';
import EventService from './../services/event-service.js';

const router = Router();
const svc = new EventService();

router.get('', async(req,res)=>{
    let respuesta;
    const returnArray = await svc.getAllASync();
    if (returnArray)
    {
        respuesta = res.status(200).json(returnArray);
    }
    else {
        respuesta = res.status(500).send("Error interno");
    }
    return respuesta;
});
router.get('/:nombre', async (req, res) => {
    let par = req.params.nombre;
    if (par)
    console.log(par);
    else{
        console.log("Error :(")
    }
    return res.status(300).send("hola");
})
export default router; 