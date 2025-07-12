
import UserRepository from "../repositories/user-repository.js";

const repo = new UserRepository();
export default class UserService{
    register = async({first_name, last_name, username, password}) =>{
        return await repo.register({first_name, last_name, username, password});
    }
}