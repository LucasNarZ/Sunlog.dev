import {
	Injectable,
	Inject,
	UnauthorizedException,
	NotFoundException,
} from '@nestjs/common';
import { DevlogEvent } from './devlog-event.entity';
import { createDevlogEventDto } from 'src/devlog-event/dtos/devlogEvent.dto';
import { devlogEventRepositoryToken } from 'src/constants';
import { Op } from 'sequelize';

@Injectable()
export class DevlogEventsService {
	constructor(
		@Inject(devlogEventRepositoryToken)
		private devlogEventRepository: typeof DevlogEvent,
	) {}

	private normalizeToArray(input?: string | string[]): string[] {
		if (!input) return [];
		return Array.isArray(input) ? input : [input];
	}
	async findDevlogEventsByTagAndCategory(
		tag?: string | string[],
		category?: string,
	): Promise<DevlogEvent[]> {
		const tags = this.normalizeToArray(tag);
		const conditions: any[] = [];

		if (tags && tags.length > 0) {
			conditions.push({
				tags: {
					[Op.overlap]: tags,
				},
			});
		}

		if (category) {
			conditions.push({
				category,
			});
		}

		const where = conditions.length > 0 ? { [Op.or]: conditions } : {};

		return this.devlogEventRepository.findAll({
			where,
		});
	}

	async createDevlogEvent(
		userId: string,
		data: createDevlogEventDto,
	) {
		return await this.devlogEventRepository.create({
			...data,
			userId
		});
	}


	async findDevlogEvent(devlogEventId: string) {
		return await this.devlogEventRepository.findOne<DevlogEvent>({
			where: {
				id: devlogEventId,
			},
		});
	}

	async findDevlogEventSlug(slug: string) {
		const post = await this.devlogEventRepository.findOne<DevlogEvent>({
			where: {
				slug,
			},
		});

		if (!post) {
			throw new NotFoundException('DevlogEvent Not Found.');
		}

		return post;
	}

	async updateDevlogEvent(devlogEventId: string, userId: string, data: createDevlogEventDto) {
		const post = await this.devlogEventRepository.findOne({
			where: {
				id: devlogEventId,
			},
		});

		if (!post) {
			throw new NotFoundException('DevlogEvent not found.');
		}

		if (post.userId !== userId) {
			throw new UnauthorizedException(
				'You are not the author of this post.',
			);
		}

		return await this.devlogEventRepository.update(data, {
			where: {
				id: devlogEventId,
			},
			returning: true,
		});
	}

	async deleteDevlogEvent(devlogEventId: string, userId: string) {
		const post = await this.findDevlogEvent(devlogEventId);

		if (!post) {
			throw new NotFoundException('DevlogEvent do not exist.');
		}

		if (post.userId !== userId) {
			throw new UnauthorizedException(
				'You have to be the author of the post to delete it.',
			);
		}

		await this.devlogEventRepository.destroy({
			where: {
				id: devlogEventId,
			},
		});

		return post;
	}

}
