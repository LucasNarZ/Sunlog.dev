import { Inject, Injectable } from "@nestjs/common";
import { usersRepositoryToken } from "src/constants";
import { User } from "./user.entity";
import { createUserDto } from "src/dtos/user.dto";

@Injectable()
export class UsersService {
    constructor(
        @Inject(usersRepositoryToken)
        private usersRepository: typeof User
    ) {}

    async findAll(){
        return await this.usersRepository.findAll()
    }

    async createUser({name, email, password}:createUserDto) {
        return await this.usersRepository.create({name, email, password})
    }

}