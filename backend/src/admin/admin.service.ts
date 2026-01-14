import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
	devlogEventRepositoryToken,
	usersRepositoryToken,
} from 'src/constants';
import { User } from 'src/user/user.entity';
import { DevlogEvent } from 'src/devlog-event/devlog-event.entity';

@Injectable()
export class AdminService {
	constructor(
		@Inject(usersRepositoryToken)
		private usersRepository: typeof User,
		@Inject(devlogEventRepositoryToken)
		private postRepository: typeof DevlogEvent,
	) {}

	async getDevlogEventsByStatus(status: string) {
		const devlogEvents = await this.postRepository.findAll();

		if (!devlogEvents) {
			throw new NotFoundException(
				'No DevlogEvents found for this status.',
			);
		}

		return devlogEvents;
	}

	// async updateDevlogEventStatus(postId: string, statusName: string) {
	// 	const status = await this.postStatusRepository.findOne({
	// 		where: {
	// 			name: statusName,
	// 		},
	// 		attributes: ['id'],
	// 	});

	// 	if (!status) {
	// 		throw new NotFoundException('DevlogEvent Status not found.');
	// 	}
	// 	const [affected] = await this.postRepository.update(
	// 		{ statusId: status.id },
	// 		{ where: { id: postId } },
	// 	);

	// 	if (affected == 0) {
	// 		throw new NotFoundException('DevlogEvent Not Found.');
	// 	}

	// 	return affected;
	// }
}
