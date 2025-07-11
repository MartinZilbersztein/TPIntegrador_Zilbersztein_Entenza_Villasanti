import DBConfig from './../configs/dbConfig.js';
import pkg from 'pg';
const {Client, Pool} = pkg;

export default class EventRepository{
    getAllAsync = async () =>{
        let retorno;
        const client = new Client(DBConfig);
        try{
            await client.connect();
            const sql = 'SELECT * FROM events';
            const result = await client.query(sql);
            await client.end();
            retorno = result.rows;
        }
        catch(error){
            console.log(error);
        }
        return retorno;
    }
    /*getPorNombre = async() =>{
        const cliente = new Client(DBConfig);
        /*try{
            await cliente.connect();
            const sql = 'SELECT * FROM events WHERE nombre = '
        }
    }*/
}