import UserRepository from "../repositories/user-repository.js";

const repo = new UserRepository();
export default class UserService{
    register = async( first_name, last_name, username, password ) =>{
        return await repo.register(first_name, last_name, username, password);
    }
    login = async (username, password) =>{
        return await repo.login(username, password);
    }
    existeEmail = async (username) =>{
        return await repo.existeEmail(username);
    }
}