import {
	Controller,
	Body,
	Get,
	Param,
	Patch,
	Query,
	UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UpdatePostStatusDto } from './dtos/updatePostStatus.dto';

@Controller('admin')
export class AdminController {
	constructor(private readonly adminService: AdminService) {}

	@UseGuards(AuthGuard)
	@Get('posts')
	async getPostsByStatus(@Query('status') status: string) {
		return await this.adminService.getPostsByStatus(status);
	}

	@UseGuards(AuthGuard)
	@Patch('post/:id')
	async updatePostStatus(
		@Param('postId') postId: string,
		@Body() body: UpdatePostStatusDto,
	) {
		return await this.adminService.updatePostStatus(postId, body.status);
	}
}
