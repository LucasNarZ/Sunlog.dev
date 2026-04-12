import { Test, TestingModule } from '@nestjs/testing';
import { GoogleAuthService } from '../googleAuth.service';
import { TokenService } from '../token.service';
import { UsersService } from '../../user/users.service';
import { UnauthorizedException } from '@nestjs/common';

type MockTokenService = {
	generateAccessToken: jest.Mock;
	generateAndStoreRefreshToken: jest.Mock;
};

type MockUsersService = {
	findByGoogleId: jest.Mock;
	getUserByEmail: jest.Mock;
	linkGoogleAccount: jest.Mock;
	createUserGoogle: jest.Mock;
};

type MockOAuthClient = {
	verifyIdToken: jest.Mock;
};

describe('GoogleAuthService', () => {
	let service: GoogleAuthService;
	let tokenServiceMock: MockTokenService;
	let usersServiceMock: MockUsersService;
	let clientMock: MockOAuthClient;

	beforeEach(async () => {
		tokenServiceMock = {
			generateAccessToken: jest.fn(),
			generateAndStoreRefreshToken: jest.fn(),
		};

		usersServiceMock = {
			findByGoogleId: jest.fn(),
			getUserByEmail: jest.fn(),
			linkGoogleAccount: jest.fn(),
			createUserGoogle: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GoogleAuthService,
				{ provide: TokenService, useValue: tokenServiceMock },
				{ provide: UsersService, useValue: usersServiceMock },
			],
		}).compile();

		service = module.get<GoogleAuthService>(GoogleAuthService);
		clientMock = {
			verifyIdToken: jest.fn(),
		};

		Reflect.set(service as object, 'client', clientMock);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('loginWithGoogle', () => {
		const idToken = 'valid_token';
		const payload = {
			sub: 'google_123',
			email: 'test@example.com',
			name: 'Test User',
		};
		const user = {
			id: 'user_123',
			name: 'Test User',
			email: 'test@example.com',
			profileImgUrl: 'url',
			isAdmin: false,
			googleId: 'google_123',
		};

		it('should verify token and login existing user by googleId', async () => {
			clientMock.verifyIdToken.mockResolvedValue({
				getPayload: () => payload,
			});
			usersServiceMock.findByGoogleId.mockResolvedValue(user);
			tokenServiceMock.generateAccessToken.mockResolvedValue('access_token');
			tokenServiceMock.generateAndStoreRefreshToken.mockResolvedValue(
				'refresh_token',
			);

			const result = await service.loginWithGoogle(idToken);

			expect(clientMock.verifyIdToken.mock.calls).toHaveLength(1);
			expect(usersServiceMock.findByGoogleId.mock.calls).toEqual([
				[payload.sub],
			]);
			expect(result).toEqual({
				accessToken: 'access_token',
				refreshToken: 'refresh_token',
			});
		});

		it('should verify token and link account if user exists by email', async () => {
			clientMock.verifyIdToken.mockResolvedValue({
				getPayload: () => payload,
			});
			usersServiceMock.findByGoogleId
				.mockResolvedValueOnce(null)
				.mockResolvedValueOnce(user);

			const existingUser = { ...user, googleId: null };
			usersServiceMock.getUserByEmail.mockResolvedValue(existingUser);
			usersServiceMock.linkGoogleAccount.mockResolvedValue(true);
			tokenServiceMock.generateAccessToken.mockResolvedValue('access_token');
			tokenServiceMock.generateAndStoreRefreshToken.mockResolvedValue(
				'refresh_token',
			);

			const result = await service.loginWithGoogle(idToken);

			expect(usersServiceMock.findByGoogleId.mock.calls).toEqual([
				[payload.sub],
				[payload.sub],
			]);
			expect(usersServiceMock.getUserByEmail.mock.calls).toEqual([
				[payload.email],
			]);
			expect(usersServiceMock.linkGoogleAccount.mock.calls).toEqual([
				[existingUser.id, payload.sub],
			]);
			expect(result).toEqual({
				accessToken: 'access_token',
				refreshToken: 'refresh_token',
			});
		});

		it('should verify token and create new user if not found', async () => {
			clientMock.verifyIdToken.mockResolvedValue({
				getPayload: () => payload,
			});
			usersServiceMock.findByGoogleId.mockResolvedValue(null);
			usersServiceMock.getUserByEmail.mockResolvedValue(null);
			usersServiceMock.createUserGoogle.mockResolvedValue(user);
			tokenServiceMock.generateAccessToken.mockResolvedValue('access_token');
			tokenServiceMock.generateAndStoreRefreshToken.mockResolvedValue(
				'refresh_token',
			);

			const result = await service.loginWithGoogle(idToken);

			expect(usersServiceMock.createUserGoogle.mock.calls).toEqual([
				[
					{
						googleId: payload.sub,
						email: payload.email,
						name: payload.name,
					},
				],
			]);
			expect(result).toEqual({
				accessToken: 'access_token',
				refreshToken: 'refresh_token',
			});
		});

		it('should throw UnauthorizedException if token verification fails', async () => {
			clientMock.verifyIdToken.mockRejectedValue(new Error('Invalid'));

			await expect(service.loginWithGoogle(idToken)).rejects.toThrow(
				UnauthorizedException,
			);
		});
	});
});
