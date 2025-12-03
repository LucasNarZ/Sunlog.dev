import { Sequelize } from 'sequelize-typescript';
import { DevlogEvent } from '../devlog-event/devlog-event.entity';
import { User } from 'src/user/user.entity';
import { Follow } from 'src/follow/follow.entity';
import { Like } from 'src/like/like.entity';
import { Comment } from 'src/comment/comment.entity';
import { Project } from 'src/project/project.entity';

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
			sequelize.addModels([
				DevlogEvent,
				User,
				Follow,
				Like,
				Comment,
				Project
			]);
			return sequelize;
		},
	},
];
