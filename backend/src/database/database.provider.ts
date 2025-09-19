import { Sequelize } from 'sequelize-typescript';
import { Post } from '../post/post.entity';
import { User } from 'src/user/user.entity';
import { Follow } from 'src/follow/follow.entity';
import { Like } from 'src/like/like.entity';

export const databaseProviders = [
	{
		provide: 'SEQUELIZE',
		useFactory: async () => {
			const sequelize = new Sequelize({
				dialect: 'postgres',
				host: 'postgres',
				port: 5432,
				username: process.env.POSTGRES_USER,
				password: process.env.POSTGRES_PASSWORD,
				database: process.env.POSTGRES_DB,
			});
			sequelize.addModels([Post, User, Follow, Like]);
			return sequelize;
		},
	},
];
