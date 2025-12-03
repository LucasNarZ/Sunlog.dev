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
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('admin')
export class AdminController {
	constructor(private readonly adminService: AdminService) {}

	
	@UseGuards(AuthGuard, AdminGuard)
	@Get('devlogEvents')
	async getDevlogEventsByStatus(@Query('status') status: string) {
		return await this.adminService.getDevlogEventsByStatus(status);
	}

	// @UseGuards(AuthGuard, AdminGuard)
	// @Patch('devlogEvents/:id')
	// async updatePostStatus(
	// 	@Param('id') postId: string,
	// 	@Body() body: UpdatePostStatusDto,
	// ) {
	// 	return await this.adminService.updatePostStatus(postId, body.status);
	// }
}
