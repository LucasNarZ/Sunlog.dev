import { Sequelize } from 'sequelize-typescript';
import { DevlogEvent } from '../devlog-event/devlog-event.entity';
import { User } from 'src/user/user.entity';
import { Follow } from 'src/follow/follow.entity';
import { Like } from 'src/like/like.entity';
import { Comment } from 'src/comment/comment.entity';
import { Project } from 'src/project/project.entity';
import { logger } from 'src/logger/logger';
import {
	dbQueryTotal,
	dbQueryDuration,
	dbErrorsTotal,
	dbConnections,
	dbIdleConnections,
} from 'src/metrics/metrics';

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
				benchmark: true,
				logging: (sql, timing) => {
					// Log normal
					logger.log('Sequelize query', {
						type: 'db',
						query: sql,
						duration: timing,
					});

					// Increment Prometheus metrics
					const queryType = sql.split(' ')[0].toUpperCase(); // SELECT, INSERT, etc.
					const modelMatch = sql.match(/FROM\s+"?(\w+)"?/i);
					const model = modelMatch ? modelMatch[1] : 'unknown';

					dbQueryTotal.inc({ model, type: queryType });
					if (timing) {
						dbQueryDuration.observe(
							{ model, type: queryType },
							timing / 1000,
						); // ms -> s
					}
				},
			});

			sequelize.addModels([
				DevlogEvent,
				User,
				Follow,
				Like,
				Comment,
				Project,
			]);

			setInterval(() => {
				const pool = (sequelize.connectionManager as any).pool;
				if (pool) {
					dbConnections.set(pool.size);
					dbIdleConnections.set(pool.available);
				}
			}, 5000);

			return sequelize;
		},
	},
];
