import EventRepository from "../repositories/event-repository.js";

const repo = new EventRepository();
export default class EventService{
    getAllASync = async({name, start_date}) =>{
        return await repo.getAllASync({name, start_date});
    }
    getAllASyncById = async(id) =>{
        return await repo.getAllASyncById(id); 
    }
    maxAssistanceLugar = async(id)=>{
        return await repo.maxAssistanceLugar(id);
    }
    anadirEvento = async(name,description,id_event_location,start_date,duration_in_minutes,price,enabled_for_enrollment,max_assistance,payloadOriginalId) =>{
        return await repo.anadirEvento(name,description,id_event_location,start_date,duration_in_minutes,price,enabled_for_enrollment,max_assistance,payloadOriginalId);
    }
    isUserEnrolled = async (userId, eventId) => {
        return await repo.isUserEnrolled(userId, eventId);
    }
    countEnrollments = async (eventId) => {
        return await repo.countEnrollments(eventId);
    }
    enrollUser = async (userId, eventId, registrationDate) => {
        return await repo.enrollUser(userId, eventId, registrationDate);
    }
    unenrollUser = async (userId, eventId) => {
        return await repo.unenrollUser(userId, eventId);
    }
}