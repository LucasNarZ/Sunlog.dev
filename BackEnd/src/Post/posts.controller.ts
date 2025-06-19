import { Req, Controller, Get, Post, Body, Patch, UseGuards, Param } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { createPostDto } from "src/dtos/post.dto";
import { Request } from "express";
import { EditPostDto } from "src/dtos/editPost.dto";
import { AuthGuard } from "src/auth/auth.guard";
import { AuthRequest } from "src/interfaces/authRequest.interface";

@Controller("post")
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get()
    async findPosts() {
        return await this.postsService.findAll();
    }

    @UseGuards(AuthGuard)
    @Post()
    async createPost(@Req() req:AuthRequest, @Body() body:createPostDto) {
        const { userId } = req.user;
        return await this.postsService.createPost(userId, body);
    }

    @Get("/id/:id")
    async findPost(@Req() req:Request){
        const postId = req.params.id;
        return await this.postsService.findPost(postId);
    }

    @Get(":slug")
    async findPostSlug(@Param("slug") slug:string){
        return await this.postsService.findPostSlug(slug);
    }

    @UseGuards(AuthGuard)
    @Patch(":postId")
    async updatePost(@Param("postId") postId:string, @Req() req:AuthRequest, @Body() body:EditPostDto){
        const { userId } = req.user;
        return await this.postsService.updatePost(postId, userId, body);
    }
}