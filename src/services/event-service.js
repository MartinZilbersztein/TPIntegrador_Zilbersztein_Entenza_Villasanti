import EventRepository from "../repositories/event-repository.js";

const repo = new EventRepository();
export default class EventService{
    getAllASync = async({name, start_date}) =>{
        return await repo.getAllASync({name, start_date});
    }
    getAllASyncById = async(id) =>{
        return await repo.getAllASyncById(id); 
    }
}