import DBConfig from './../configs/dbConfig.js';
import pkg from 'pg';
const {Client, Pool} = pkg;

export default class UserRepository{
    register = async ( first_name, last_name, username, password ) =>{
        const client = new Client(DBConfig);
        let retorno;
        try{
            await client.connect();
            const sql = `INSERT INTO users (first_name, last_name, username, password) VALUES ('${first_name}','${last_name}', '${username}', '${password}') RETURNING *`;
            console.log(sql);
            const result = await client.query(sql);
            await client.end();
            retorno = result.rows;
        }
        catch(error){
            console.log(error);
        }
        return retorno;
    }
    login = async (username, password) =>{
        const client = new Client(DBConfig);
        let retorno;
        try{
            await client.connect();
            const sql = `SELECT id, username FROM users WHERE username = '${username}' AND password = '${password}'`;
            const result = await client.query(sql);
            await client.end();
            retorno = result.rows;
        }
        catch(error){
            console.log(error);
        }
        return retorno;
    }
    existeEmail = async (username) =>{
        const client = new Client(DBConfig);
        let retorno;
        try{
            await client.connect();
            const sql = `SELECT username FROM users WHERE username = '${username}'`
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