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
    modificarEvento = async(name,description,id_event_location,start_date,duration_in_minutes,price,enabled_for_enrollment,max_assistance,id) =>{
        return await repo.modificarEvento(name,description,id_event_location,start_date,duration_in_minutes,price,enabled_for_enrollment,max_assistance,id);
    }
    eliminarEvento = async(id) =>{
        return await repo.eliminarEvento(id);
    }
    isUserEnrolled = async (id_user, id_event) => {
        return await repo.isUserEnrolled(id_user, id_event);
    }
    countEnrollments = async (id_event) => {
        return await repo.countEnrollments(id_event);
    }
    enrollUser = async (id_user, id_event, registration_date_time) => {
        return await repo.enrollUser(id_user, id_event, registration_date_time);
    }
    unenrollUser = async (id_user, id_event) => {
        return await repo.unenrollUser(id_user, id_event);
    }
}