import { Post } from "./post.entity";
import { postsRepositoryToken } from "src/constants";

export const postsProviders = [
    {
        provide: postsRepositoryToken,
        useValue: Post
    }
]