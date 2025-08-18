import DBConfig from './../configs/dbConfig.js';
import pkg from 'pg';
const {Client, Pool} = pkg;


export default class EventLocationRepo{
    getAll = async (id) =>{
        const client = new Client(DBConfig);
        let retorno;
        try{
            await client.connect();
            const sql = `select * from public.event_locations where id_creator_user = ${id}`;
            const result = await client.query(sql);
            await client.end();
            retorno = result.rows;
        }
        catch(error){
            console.log(error);
        }
        return retorno;
    }
}