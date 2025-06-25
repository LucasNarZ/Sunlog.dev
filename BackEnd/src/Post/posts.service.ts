import { Injectable, Inject, UnauthorizedException, NotFoundException, ConflictException } from "@nestjs/common";
import { Post } from "./post.entity";
import { createPostDto } from "src/Post/dtos/post.dto";
import { likesRepositoryToken, postsRepositoryToken } from "src/constants";
import { EditPostDto } from "src/Post/dtos/editPost.dto";
import { Like } from "./like.entity";

@Injectable()
export class PostsService {
    constructor(
        @Inject(postsRepositoryToken)
        private postsRepository: typeof Post,
        @Inject(likesRepositoryToken)
        private likesRepository: typeof Like
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
        const post = await this.postsRepository.findOne<Post>({
            where: {
                slug
            }
        })

        if(!post){
            throw new NotFoundException("Post Not Found.")
        }

        return post
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

    async likePost(likerId:string, likedId:string){
        const relation = await this.likesRepository.findOne({
            where:{
                likerId,
                likedId
            }
        })

        if(relation){
            throw new ConflictException("You already liked this.")
        }

        await this.postsRepository.increment("likes", {
            where:{
                id: likedId
            }
        })

        await this.likesRepository.create(
            {
                likerId,
                likedId
            }
        )

        return { message: 'Followed successfully' };
    }

    async unlikePost(likerId:string, likedId:string){
        const relation = await this.likesRepository.findOne({
            where:{
                likerId,
                likedId
            }
        })

        if(!relation){
            throw new ConflictException("You don't liked this post.")
        }

        await this.postsRepository.decrement("likes", {
            where:{
                id: likedId
            }
        })

        await this.likesRepository.destroy(
            {
                where:{
                    likerId,
                    likedId
                }
            }
        )

        return { message: 'Followed successfully' };
    }

    async getLikePost(likerId:string, likedId:string) {
        return !!(await this.likesRepository.findOne({
            where:{
                likerId,
                likedId
            }
        }))
    }

}