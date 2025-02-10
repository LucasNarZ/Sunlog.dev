import { Controller, Get, Post, Body } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { createPostDto } from "src/dtos/post.dto";

@Controller()
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get("post")
    async findPosts() {
        return await this.postsService.findAll()
    }

    @Post("post")
    async createPost(@Body() body:createPostDto) {
        return await this.postsService.createPost(body)
    }
}