import {
	Controller,
	Get,
	Body,
	Req,
	Put,
	UseGuards,
	UnauthorizedException,
	Param,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UsersService } from './users.service';
import { updateUserDto } from 'src/user/dtos/updateUser.dto';
import { UserNotFoundException } from 'src/exceptions/UserNotFound.exception';
import { AuthRequest } from 'src/interfaces/authRequest.interface';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@UseGuards(AuthGuard)
	@Get('me')
	async findLoggedUser(@Req() req: AuthRequest) {
		const id = req.user.userId;
		if (!id) {
			throw new UnauthorizedException('User is not logged');
		}
		const user = await this.usersService.findLoggedUser(id);
		if (!user) {
			throw new UserNotFoundException(`user with id ${id} not found`);
		}
		return user;
	}

	@Get('trending')
	async getTrendingUsers() {
		return await this.usersService.getTrendingUsers();
	}

	@Get(':slug')
	async findUser(@Req() req: AuthRequest, @Param('slug') slug: string) {
		const userId = req?.user?.userId;
		return await this.usersService.findUser(slug, userId);
	}

	@UseGuards(AuthGuard)
	@Put('me')
	async updateUser(@Req() req: AuthRequest, @Body() body: updateUserDto) {
		const id = req?.user?.userId;
		return await this.usersService.updateUser(id, body);
	}

	@UseGuards(AuthGuard)
	@Get('/me/id')
	getLoggedUserId(@Req() req: AuthRequest) {
		return req?.user?.userId;
	}
}
