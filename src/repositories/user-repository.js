import DBConfig from './../configs/dbConfig.js';
import pkg from 'pg';
const {Client, Pool} = pkg;

export default class UserRepository{
    register = async (first_name, last_name, username, password) =>{
        const client = new Client(DBConfig);
        let retorno;
        try{
            const sql = "INSERT INTO users (first_name, last_name, username, password) VALUES (" + first_name + ", " + last_name + ", " + username + ", " + password + ") RETURNING *";
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