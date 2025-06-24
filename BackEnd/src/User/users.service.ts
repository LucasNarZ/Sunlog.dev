import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { followsRepositoryToken, postsRepositoryToken, sequelizeToken, usersRepositoryToken } from "src/constants";
import { User } from "./user.entity";
import { createUserDto } from "src/User/dtos/user.dto";
import { Post } from "src/Post/post.entity";
import { updateUserDto } from "src/User/dtos/updateUser.dto";
import { Follow } from "./follow.entity";
import { Sequelize } from "sequelize";

@Injectable()
export class UsersService {
    constructor(
        @Inject(sequelizeToken)
        private readonly sequelize: Sequelize,
        @Inject(usersRepositoryToken)
        private usersRepository: typeof User,
        @Inject(postsRepositoryToken)
        private postsRepository: typeof Post,
        @Inject(followsRepositoryToken)
        private followsRepository: typeof Follow
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
            attributes:["name", "profileImgUrl", "bio", "followers", "createdAt"],
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

    async followUser(followerId:string, followedId:string){
        if(followedId === followerId){
            throw new BadRequestException("You can't follow yourself.")
        }
        return await this.sequelize.transaction(async (t) => {
            const relation = await this.followsRepository.findOne({
                where:{
                    followerId,
                    followedId,
                    lock: t.LOCK.UPDATE
                },
                transaction: t
            })

            if(relation){
                throw new ConflictException("You already follow this user.")
            }

            await this.usersRepository.increment(1, {
                where:{
                    userId: followedId
                },
                transaction: t
            })

            await this.followsRepository.create(
                {
                    followerId,
                    followedId
                },
                {transaction: t}
            )

            return { message: 'Followed successfully' };
        })

    }

    async unfollowUser(followerId:string, followedId:string){
        if(followedId === followerId){
            throw new BadRequestException("You can't unfollow yourself.")
        }
        return await this.sequelize.transaction(async (t) => {
            const relation = await this.followsRepository.findOne({
                where:{
                    followerId,
                    followedId,
                    lock: t.LOCK.UPDATE
                },
                transaction: t
            })

            if(!relation){
                throw new NotFoundException("You don't follow this user.")
            }

            await this.usersRepository.decrement(1, {
                where:{
                    userId: followedId
                },
                transaction: t
            })

            await this.followsRepository.destroy(
                {
                    where:{
                        followerId,
                        followedId
                    },
                    transaction: t
                }
            )

            return { message: 'Unfollowed successfully' };
        })

    }

    async getFollowUser(followerId:string, followedId:string) {
        return !!(await this.followsRepository.findOne({
            where:{
                followerId,
                followedId
            }
        }))
    }

}