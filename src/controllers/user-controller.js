import {Router} from 'express';
import UserService from './../services/user-service.js';

const router = Router();
const svc = new UserService();

router.post('/login', async(req,res)=>{

})
router.post('/register', async(req,res)=>{
    const {first_name, last_name, username, password} = req.body;
    let mensajeError, todoOk = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let returnArray, respuesta;

    if (first_name.length < 3 || last_name.length < 3) {todoOk = false; mensajeError = "El nombre y apellido deben tener, al menos, tres letras."};
    if (!emailRegex.test(username)) {todoOk = false; mensajeError = "Email no válido";} 
    if (password.length < 3 || !password) {todoOk = false; mensajeError = "Contraseña no válida";}
    if (!todoOk) respuesta = res.status(400).send(mensajeError);
    else
    {
       try{
        returnArray = await svc.register(first_name, last_name, username, password);
        }
       catch(error){
        console.log(error);
       } 
        respuesta = res.status(201).send("Creado");
    }
    return respuesta;
})


export default router;