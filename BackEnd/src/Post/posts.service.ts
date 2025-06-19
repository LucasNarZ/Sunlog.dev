import { Injectable, Inject, UnauthorizedException, NotFoundException } from "@nestjs/common";
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

    async createPost(userId:string, {title, content, authorId, tags, categorys, previewImgUrl, description, slug}:createPostDto) {
        if(userId !== authorId){
            throw new UnauthorizedException("Permission Denied.")
        }
        return await this.postsRepository.create({title, content, userId: authorId, tags, categorys, previewImgUrl, description, slug})
    }
    
    async findPost(postId:string) {
        return await this.postsRepository.findOne<Post>({
            where: {
                id: postId
            }
        })
    }

    async findPostSlug(slug:string) {
        return await this.postsRepository.findOne<Post>({
            where: {
                slug
            }
        })
    }

    async updatePost(postId:string, userId:string, data:EditPostDto) {
        const post = await this.postsRepository.findOne({
            where:{
                postId
            }
        })

        if(!post) {
            throw new NotFoundException("Post not found.")
        }

        if(post.userId !== userId) {
            throw new UnauthorizedException("You are not the author of this post.")
        }

        return await this.postsRepository.update(data, 
            {
                where: {
                    id: postId
                }
            }
        )
    }

}