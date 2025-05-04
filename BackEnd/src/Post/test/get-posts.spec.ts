import { Test, TestingModule } from "@nestjs/testing";
import { PostsController } from "../posts.controller";
import { PostsService } from "../posts.service";

describe("PostsController", () => {
  let postsController: PostsController;

  const mockPostsService = {
    findAll: jest.fn(() => Promise.resolve([{ id: 1, title: "Test Post", content: "This is a test post" }])),
    createPost: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [{ provide: PostsService, useValue: mockPostsService }],
    }).compile();

    postsController = module.get<PostsController>(PostsController);
  });

  it("should return all posts", async () => {
    await expect(postsController.findPosts()).resolves.toEqual([
      { id: 1, title: "Test Post", content: "This is a test post" },
    ]);
  });

  it("should create a new post", async () => {
    const postDto = { title: "New Post", content: "This is a new post", author:"sdad" };
    mockPostsService.createPost.mockResolvedValue({ id: 2, ...postDto });

    await expect(postsController.createPost(postDto)).resolves.toEqual({
      id: 2,
      author:"sdad",
      title: "New Post",
      content: "This is a new post",
    });
  });
});
