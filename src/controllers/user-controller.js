import {Router} from 'express';
import UserService from './../services/user-service.js';
import jwt from 'jsonwebtoken';

const router = Router();
const svc = new UserService();

router.post('/login', async(req,res)=>{
    const {username, password} = req.body;
    let token = "";
    let mensajeError, todoOk = true;
    let returnArray, respuesta;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {todoOk = false; mensajeError = {mensaje: "Email no válido", token: token}} 
    if (!todoOk) respuesta = res.status(400).send(mensajeError);
    else
    {
        try{
            returnArray = await svc.login(username, password);
            if(returnArray.length > 0){
                const payload ={
                    id: returnArray[0].id,
                    username: returnArray[0].username
                }
                const secretKey = 'maBalls';
                const options ={
                    expiresIn: '2h',
                    issuer: 'yo'
                }
                token = jwt.sign(payload, secretKey, options);
                console.log(token);
                respuesta = res.status(200).send({
                    mensaje: 'Logeado',
                    token: token
                });
            }
            else respuesta = res.status(401).send({mensaje: 'El usuario o clave es invalido', token: token});
        }
        catch(error){
            console.log(error);
        } 
    }
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
        respuesta = res.status(201).send("Creado");
       }
       catch(error){
        console.log(error);
       } 
    }
    return respuesta;
})


export default router;