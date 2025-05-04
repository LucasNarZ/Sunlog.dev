import { Req, Controller, Get, Post, Body } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { createPostDto } from "src/dtos/post.dto";
import { Request } from "express";

@Controller("post")
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get()
    async findPosts() {
        return await this.postsService.findAll()
    }

    @Post()
    async createPost(@Body() body:createPostDto) {
        return await this.postsService.createPost(body)
    }

    @Get(":id")
    async findPost(@Req() req:Request){
        const postId = req.params.id
        return await this.postsService.findPost(postId)
    }
}