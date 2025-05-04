import { Injectable, Inject } from "@nestjs/common";
import { Post } from "./post.entity";
import { createPostDto } from "src/dtos/post.dto";
import { postsRepositoryToken } from "src/constants";

@Injectable()
export class PostsService {
    constructor(
        @Inject(postsRepositoryToken)
        private postsRepository:typeof Post
    ) {}

    async findAll(): Promise<Post[]>{
        return await this.postsRepository.findAll<Post>()
    }

    async createPost({title, content, authorId, tags, categorys}:createPostDto) {
        return await this.postsRepository.create({title, content, userId: authorId, tags, categorys})
    }
    async findPost(postId:string) {
        return await this.postsRepository.findOne<Post>({
            where: {
                id: postId
            }
        })
    }

}