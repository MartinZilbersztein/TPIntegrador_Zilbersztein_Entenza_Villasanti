import DBConfig from './../configs/dbConfig.js';
import pkg from 'pg';
const {Client, Pool} = pkg;

export default class EventRepository{
    getAllASync = async ({name, start_date}) =>{
        const condiciones = [];
        if (name) {
            condiciones.push(`e.name ILIKE '%${name}%'`);
        }

        if (start_date) {
            condiciones.push(`e.start_date = '${start_date}'`);
        }        

        const where = condiciones.length > 0 ? 'WHERE ' + condiciones.join(' AND ') : '';
        let retorno;
        const client = new Client(DBConfig);
        try{
            let consulta = `SELECT json_build_object(
            'id', e.id,
            'name', e.name,
            'description', e.description,
            'start_date', e.start_date,
            'duration_in_minutes', e.duration_in_minutes,
            'price', e.price,
            'enabled_for_enrollment', e.enabled_for_enrollment,
            'max_assistance', e.max_assistance,
            'event_location', json_build_object(
                'id', el.id,
                'name', el.name,
                'location', json_build_object(
                    'id', l.id,
                    'name', l.name,
                    'province', json_build_object(
                        'id',p.id,
                        'name',p.name
                        )
                    )
                ),
            'users', json_build_object(
                'id', u.id,
                'first_name', u.first_name,
                'last_name', u.last_name,
                'username', u.username,
                'password', u.password
                )
            ) AS event from events e INNER JOIN event_locations el ON el.id = e.id_event_location
            INNER JOIN locations l ON l.id = el.id_location
            INNER JOIN provinces p ON p.id = l.id_province 
            INNER JOIN users u on u.id = e.id_creator_user ${where}`
            await client.connect();
            const result = await client.query(consulta);
            await client.end();
            retorno = result.rows;
        }
        catch(error){
            console.log(error);
        }
        return retorno;
    }
    getAllASyncById = async(id) =>{
        let retorno;
        const client = new Client(DBConfig);
        try{
            await client.connect();
            const sql = `SELECT json_build_object(
            'id', e.id,
            'name', e.name,
            'description', e.description,
            'start_date', e.start_date,
            'duration_in_minutes', e.duration_in_minutes,
            'price', e.price,
            'enabled_for_enrollment', e.enabled_for_enrollment,
            'max_assistance', e.max_assistance,
            'event_location', json_build_object(
                'id', el.id,
                'name', el.name,
                'location', json_build_object(
                    'id', l.id,
                    'name', l.name,
                    'province', json_build_object(
                        'id',p.id,
                        'name',p.name
                        )
                    )
                ),
            'users', json_build_object(
                'id', u.id,
                'first_name', u.first_name,
                'last_name', u.last_name,
                'username', u.username,
                'password', u.password
                )
            ) AS event from events e INNER JOIN event_locations el ON el.id = e.id_event_location
            INNER JOIN locations l ON l.id = el.id_location
            INNER JOIN provinces p ON p.id = l.id_province 
            INNER JOIN users u on u.id = e.id_creator_user where e.id = ${id}`;
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