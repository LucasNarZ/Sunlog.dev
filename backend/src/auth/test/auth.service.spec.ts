import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/user/users.service';
import { TokenService } from '../token.service';
import { EmailService } from 'src/email/email.service';
import * as argon2 from 'argon2';
import { UniqueConstraintException } from 'src/exceptions/uniqueContraint.exception';

describe('AuthService', () => {
	let service: AuthService;
	let usersService: {
		createUser: jest.Mock;
		getUserByEmail: jest.Mock;
	};
	let emailService: {
		sendWelcomeEmail: jest.Mock;
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: UsersService,
					useValue: {
						createUser: jest.fn(),
						getUserByEmail: jest.fn(),
					},
				},
				{
					provide: TokenService,
					useValue: {
						generateAccessToken: jest.fn(),
						generateAndStoreRefreshToken: jest.fn(),
						getTokenPayload: jest.fn(),
						deleteRefreshToken: jest.fn(),
					},
				},
				{
					provide: EmailService,
					useValue: {
						sendWelcomeEmail: jest.fn(),
					},
				},
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
		usersService = module.get(UsersService);
		emailService = module.get(EmailService);
		jest.restoreAllMocks();
	});

	describe('register', () => {
		it('should create a user and enqueue welcome email', async () => {
			const dto = {
				name: 'John Doe',
				email: 'john@sunlog.dev',
				password: 'plain-password',
			};
			const createdUser = {
				id: '1',
				name: dto.name,
				email: dto.email,
				slug: 'john_doe',
			};

			jest.spyOn(argon2, 'hash').mockResolvedValue('hashed-password');
			usersService.createUser.mockResolvedValue(createdUser);

			await expect(service.register(dto)).resolves.toEqual(createdUser);

			expect(usersService.createUser).toHaveBeenCalledWith({
				...dto,
				password: 'hashed-password',
			});
			expect(emailService.sendWelcomeEmail).toHaveBeenCalledWith(createdUser);
		});

		it('should map unique constraint errors during registration', async () => {
			const dto = {
				name: 'John Doe',
				email: 'john@sunlog.dev',
				password: 'plain-password',
			};
			const uniqueConstraintError = new Error('duplicate email');
			uniqueConstraintError.name = 'SequelizeUniqueConstraintError';

			jest.spyOn(argon2, 'hash').mockResolvedValue('hashed-password');
			usersService.createUser.mockRejectedValue(uniqueConstraintError);

			await expect(service.register(dto)).rejects.toThrow(
				UniqueConstraintException,
			);
			expect(emailService.sendWelcomeEmail).not.toHaveBeenCalled();
		});
	});
});
