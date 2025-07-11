import EventRepository from "../repositories/event-repository.js";

export default class EventService{
    getAllASync = async() =>{
        const repo = new EventRepository();
        const retorno = await repo.getAllAsync();
        return retorno;
    }
}