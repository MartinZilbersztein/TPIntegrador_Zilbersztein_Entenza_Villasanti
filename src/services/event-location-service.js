import EventLocationRepo from "../repositories/event-location-repository.js";

const repo = new EventLocationRepo();
export default class EventLocationService{
    getAll = async(id) =>{
        return await repo.getAll(id);
    }
}