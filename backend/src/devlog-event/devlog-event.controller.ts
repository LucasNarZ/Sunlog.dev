import {
	Req,
	Controller,
	Get,
	Post,
	Body,
	Patch,
	UseGuards,
	Param,
	BadRequestException,
	Query,
	Delete,
	Put,
} from '@nestjs/common';
import { DevlogEventsService } from './devlog-event.service';
import { createDevlogEventDto } from 'src/devlog-event/dtos/devlogEvent.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AuthRequest } from 'src/interfaces/authRequest.interface';
import { isUUID } from 'class-validator';

@Controller('devlogEvents')
export class DevlogEventsController {
	constructor(private readonly devlogEventsService: DevlogEventsService) {}

	@Get()
	async findDevlogEventsByTagAndCategory(
		@Query('tag') tag: string | string[] | undefined,
		@Query('category') category: string | undefined,
	) {
		return await this.devlogEventsService.findDevlogEventsByTagAndCategory(
			tag,
			category,
		);
	}

	@UseGuards(AuthGuard)
	@Post()
	async createPost(
		@Req() req: AuthRequest,
		@Body() body: createDevlogEventDto,
	) {
		const { userId } = req.user;
		return await this.devlogEventsService.createDevlogEvent(userId, body);
	}
	@Get(':devlogEventId')
	async findPost(@Req() req: Request) {
		const devlogEventId = req.params.devlogEventId;
		return await this.devlogEventsService.findDevlogEvent(devlogEventId);
	}

	@Get('slug/:slug')
	async findPostSlug(@Param('slug') slug: string) {
		return await this.devlogEventsService.findDevlogEventSlug(slug);
	}

	@UseGuards(AuthGuard)
	@Put(':devlogEventId')
	async updateDevlogEvent(
		@Param('devlogEventId') devlogEventId: string,
		@Req() req: AuthRequest,
		@Body() body: createDevlogEventDto,
	) {
		const { userId } = req.user;
		return await this.devlogEventsService.updateDevlogEvent(
			devlogEventId,
			userId,
			body,
		);
	}

	@UseGuards(AuthGuard)
	@Delete(':devlogEventId')
	async deleteDevlogEvent(
		@Param('devlogEventId') devlogEventId: string,
		@Req() req: AuthRequest,
	) {
		if (!isUUID(devlogEventId)) {
			throw new BadRequestException('devlogEventId must be an UUID.');
		}
		const { userId } = req.user;

		return this.devlogEventsService.deleteDevlogEvent(
			devlogEventId,
			userId,
		);
	}
}
