import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { postsRepositoryToken, usersRepositoryToken } from "src/constants";
import { User } from "./user.entity";
import { createUserDto } from "src/dtos/user.dto";
import { Post } from "src/Post/post.entity";
import { updateUserDto } from "src/dtos/updateUser.dto";

@Injectable()
export class UsersService {
    constructor(
        @Inject(usersRepositoryToken)
        private usersRepository: typeof User,
        @Inject(postsRepositoryToken)
        private postsRepository: typeof Post
    ) {}

    async createUser({name, email, password}:createUserDto) {
        return await this.usersRepository.create({name, email, password});
    }

    async getUserByEmail(email:string) {
        return await this.usersRepository.findOne({where:{email}});
    }

    async findUserBasic(id:string) {
        return await this.usersRepository.findOne({
            attributes:["name", "profileImgUrl", "followers"],
            where:{
                id
            }
        });
    }

    async findUser(id:string) {
        return await this.usersRepository.findOne({
            where:{
                id
            }
        });
    }

    async findUserPublic(id:string) {
        const user = await this.usersRepository.findOne({
            attributes:["name", "profileImgUrl", "bio", "followers"],
            where:{
                id
            }
        });
        if(!user){
            throw new NotFoundException("User not found!")
        }

        return user
    }

    async getPostByUser(id:string) {
        const posts = await this.postsRepository.findAll({
            where: {
                userId: id
            }
        })
        if(posts.length == 0){
            throw new NotFoundException("User don't have posts");
        }
        return posts;
    }

    async updateUser(id:string, data:updateUserDto) {
        return this.usersRepository.update(data,
            {
                where: {
                    id
                }
            }
        )
    }

}