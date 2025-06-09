import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { postsRepositoryToken, usersRepositoryToken } from "src/constants";
import { User } from "./user.entity";
import { createUserDto } from "src/dtos/user.dto";
import { Post } from "src/Post/post.entity";

@Injectable()
export class UsersService {
    constructor(
        @Inject(usersRepositoryToken)
        private usersRepository: typeof User,
        @Inject(postsRepositoryToken)
        private postsRepository: typeof Post
    ) {}

    async findAll(){
        return await this.usersRepository.findAll();
    }

    async createUser({name, email, password}:createUserDto) {
        return await this.usersRepository.create({name, email, password});
    }

    async getUserByEmail(email:string) {
        return await this.usersRepository.findOne({where:{email}});
    }

    async findUser(id:string) {
        return await this.usersRepository.findOne({where:{id}});
    }

    async getPostByUser(id:string) {
        const posts = await this.postsRepository.findAll({
            where: {
                userId: id
            }
        })
        if(posts.length == 0){
            throw new NotFoundException("User has no posts");
        }
        return posts;
    }

}