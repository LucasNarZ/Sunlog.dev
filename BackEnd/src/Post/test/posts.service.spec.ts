import { Test, TestingModule } from '@nestjs/testing'
import { PostsService } from '../posts.service'
import { postsRepositoryToken, likesRepositoryToken } from 'src/constants'
import { UnauthorizedException, NotFoundException, ConflictException } from '@nestjs/common'

describe('PostsService', () => {
  let service: PostsService
  let postsRepository: {
    create: jest.Mock,
    findOne: jest.Mock,
    findAll: jest.Mock,
    update: jest.Mock,
    increment: jest.Mock,
    decrement: jest.Mock
  }
  let likesRepository: {
    findOne: jest.Mock,
    create: jest.Mock,
    destroy: jest.Mock
  }

  beforeEach(async () => {
    postsRepository = {
      create: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      increment: jest.fn(),
      decrement: jest.fn()
    }
    likesRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      destroy: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: postsRepositoryToken, useValue: postsRepository },
        { provide: likesRepositoryToken, useValue: likesRepository }
      ]
    }).compile()

    service = module.get<PostsService>(PostsService)
  })

  describe('createPost', () => {
    it('should create a post if userId matches authorId', async () => {
      const dto = { title: 't', content: 'c', authorId: '1', tags: [], categorys: [], previewImgUrl: '', description: '', slug: 'test' }
      postsRepository.create.mockResolvedValue(dto)
      await expect(service.createPost('1', dto)).resolves.toEqual(dto)
    })

    it('should throw if userId does not match authorId', async () => {
      const dto = { title: 't', content: 'c', authorId: '2', tags: [], categorys: [], previewImgUrl: '', description: '', slug: 'test' }
      await expect(service.createPost('1', dto)).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('findPostSlug', () => {
    it('should return post if found', async () => {
      const post = { id: '1' }
      postsRepository.findOne.mockResolvedValue(post)
      await expect(service.findPostSlug('slug')).resolves.toEqual(post)
    })

    it('should throw if post not found', async () => {
      postsRepository.findOne.mockResolvedValue(null)
      await expect(service.findPostSlug('slug')).rejects.toThrow(NotFoundException)
    })
  })

	describe('updatePost', () => {
		const validPostData = {
				title: 'New Title',
				description: 'New Description',
				content: 'New Content',
		}

		it('should throw if post not found', async () => {
				postsRepository.findOne.mockResolvedValue(null)
				await expect(service.updatePost('pid', 'uid', validPostData)).rejects.toThrow(NotFoundException)
		})

		it('should throw if user is not author', async () => {
				postsRepository.findOne.mockResolvedValue({ userId: 'other' })
				await expect(service.updatePost('pid', 'uid', validPostData)).rejects.toThrow(UnauthorizedException)
		})

		it('should update post if user is author', async () => {
				postsRepository.findOne.mockResolvedValue({ userId: 'user-id' })
				postsRepository.update.mockResolvedValue({})

				await expect(
				service.updatePost('post-id', 'user-id', validPostData)
				).resolves.toEqual({})
		})
	})

  describe('likePost', () => {
    it('should throw if already liked', async () => {
      likesRepository.findOne.mockResolvedValue({})
      await expect(service.likePost('uid', 'pid')).rejects.toThrow(ConflictException)
    })

    it('should like post and return message', async () => {
      likesRepository.findOne.mockResolvedValue(null)
      postsRepository.increment.mockResolvedValue(null)
      likesRepository.create.mockResolvedValue(null)

      await expect(service.likePost('uid', 'pid')).resolves.toEqual({ message: 'Followed successfully' })
    })
  })

  describe('unlikePost', () => {
    it('should throw if not liked', async () => {
      likesRepository.findOne.mockResolvedValue(null)
      await expect(service.unlikePost('uid', 'pid')).rejects.toThrow(ConflictException)
    })

    it('should unlike post and return message', async () => {
      likesRepository.findOne.mockResolvedValue({})
      postsRepository.decrement.mockResolvedValue(null)
      likesRepository.destroy.mockResolvedValue(null)

      await expect(service.unlikePost('uid', 'pid')).resolves.toEqual({ message: 'Followed successfully' })
    })
  })

  describe('getLikePost', () => {
    it('should return true if liked', async () => {
      likesRepository.findOne.mockResolvedValue({})
      await expect(service.getLikePost('uid', 'pid')).resolves.toBe(true)
    })

    it('should return false if not liked', async () => {
      likesRepository.findOne.mockResolvedValue(null)
      await expect(service.getLikePost('uid', 'pid')).resolves.toBe(false)
    })
  })
})
