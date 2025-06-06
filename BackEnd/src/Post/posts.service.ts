import { Injectable, Inject } from "@nestjs/common";
import { Post } from "./post.entity";
import { createPostDto } from "src/dtos/post.dto";
import { postsRepositoryToken } from "src/constants";
import { EditPostDto } from "src/dtos/editPost.dto";

@Injectable()
export class PostsService {
    constructor(
        @Inject(postsRepositoryToken)
        private postsRepository:typeof Post
    ) {}

    async findAll(): Promise<Post[]>{
        return await this.postsRepository.findAll<Post>()
    }

    async createPost({title, content, authorId, tags, categorys, previewImgUrl, description}:createPostDto) {
        return await this.postsRepository.create({title, content, userId: authorId, tags, categorys, previewImgUrl, description})
    }
    async findPost(postId:string) {
        return await this.postsRepository.findOne<Post>({
            where: {
                id: postId
            }
        })
    }

    async updatePost(postId:string, title:string, content:string) {
        let update = {};
        if(title) {
            Object.defineProperty(update, "title", {value:title})
        }
        if(content) {
            Object.defineProperty(update, "content", {value:content})
        } 

        return await this.postsRepository.update(
            update, 
            {where: {
                id: postId
            }
            }
        )
    }

}