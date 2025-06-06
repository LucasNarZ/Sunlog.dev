import { Req, Controller, Get, Post, Body, Put } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { createPostDto } from "src/dtos/post.dto";
import { Request } from "express";
import { EditPostDto } from "src/dtos/editPost.dto";

@Controller("post")
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get()
    async findPosts() {
        return await this.postsService.findAll();
    }

    @Post()
    async createPost(@Body() body:createPostDto) {
        return await this.postsService.createPost(body);
    }

    @Get(":id")
    async findPost(@Req() req:Request){
        const postId = req.params.id;
        return await this.postsService.findPost(postId);
    }

    @Put(":id")
    async updatePost(@Req() req:Request, @Body() body:EditPostDto){
        const { postId } = req.params;
        return await this.postsService.updatePost(postId, body.title ?? "", body.content ?? "")
    }
}