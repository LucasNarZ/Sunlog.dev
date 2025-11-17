import { postsRepositoryToken, postStatusesRepositryToken, usersRepositoryToken } from 'src/constants';
import { User } from 'src/user/user.entity';
import { Post } from 'src/post/post.entity';
import { PostStatus } from 'src/post/postStatus.entity';

export const adminProviders = [
	{
		provide: usersRepositoryToken,
		useValue: User,
	},
	{
		provide: postsRepositoryToken,
		useValue: Post,
	},
    {
        provide: postStatusesRepositryToken,
        useValue: PostStatus
    }
];
