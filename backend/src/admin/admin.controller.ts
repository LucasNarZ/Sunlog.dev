import {
	Controller,
    Get,
    Param,
    Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
	constructor(private readonly adminService: AdminService) {}

    @Get("posts")
    async getPostsByStatus(@Query("status") status: string) {
        return await this.adminService.getPostsByStatus(status);
    }
}
