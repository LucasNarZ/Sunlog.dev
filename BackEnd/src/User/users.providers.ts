import { followsRepositoryToken, postsRepositoryToken, usersRepositoryToken, sequelizeToken } from "src/constants";
import { User } from "./user.entity";
import { Post } from "src/Post/post.entity";
import { Follow } from "./follow.entity";
import { Sequelize } from "sequelize-typescript"

export const usersProviders = [
    {
        provide: usersRepositoryToken,
        useValue: User
    },
    {
        provide: postsRepositoryToken,
        useValue: Post
    },
    {
        provide: followsRepositoryToken,
        useValue: Follow
    },
    {
        provide: sequelizeToken,
        useValue: Sequelize
    }
]