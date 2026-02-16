import { Test, TestingModule } from '@nestjs/testing';
import { GoogleAuthService } from '../googleAuth.service';
import { TokenService } from '../token.service';
import { UsersService } from '../../user/users.service';
import { UnauthorizedException } from '@nestjs/common';

describe('GoogleAuthService', () => {
    let service: GoogleAuthService;
    let tokenService: TokenService;
    let usersService: UsersService;
    let clientMock: any;

    beforeEach(async () => {
        const tokenServiceMock = {
            generateAccessToken: jest.fn(),
            generateAndStoreRefreshToken: jest.fn(),
        };

        const usersServiceMock = {
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
        tokenService = module.get<TokenService>(TokenService);
        usersService = module.get<UsersService>(UsersService);

        // Mock OAuth2Client
        clientMock = {
            verifyIdToken: jest.fn(),
        };
        (service as any).client = clientMock;
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
            (usersService.findByGoogleId as jest.Mock).mockResolvedValue(user);
            (tokenService.generateAccessToken as jest.Mock).mockResolvedValue(
                'access_token',
            );
            (
                tokenService.generateAndStoreRefreshToken as jest.Mock
            ).mockResolvedValue('refresh_token');

            const result = await service.loginWithGoogle(idToken);

            expect(clientMock.verifyIdToken).toHaveBeenCalled();
            expect(usersService.findByGoogleId).toHaveBeenCalledWith(
                payload.sub,
            );
            expect(result).toEqual({
                accessToken: 'access_token',
                refreshToken: 'refresh_token',
            });
        });

        it('should verify token and link account if user exists by email', async () => {
            clientMock.verifyIdToken.mockResolvedValue({
                getPayload: () => payload,
            });
            // First findByGoogleId returns null
            (usersService.findByGoogleId as jest.Mock)
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce(user); // Second call returns linked user

            // getUserByEmail returns existing user
            const existingUser = { ...user, googleId: null };
            (usersService.getUserByEmail as jest.Mock).mockResolvedValue(
                existingUser,
            );

            (usersService.linkGoogleAccount as jest.Mock).mockResolvedValue(
                true,
            );
            (tokenService.generateAccessToken as jest.Mock).mockResolvedValue(
                'access_token',
            );
            (
                tokenService.generateAndStoreRefreshToken as jest.Mock
            ).mockResolvedValue('refresh_token');

            const result = await service.loginWithGoogle(idToken);

            expect(usersService.findByGoogleId).toHaveBeenNthCalledWith(
                1,
                payload.sub,
            );
            expect(usersService.getUserByEmail).toHaveBeenCalledWith(
                payload.email,
            );
            expect(usersService.linkGoogleAccount).toHaveBeenCalledWith(
                existingUser.id,
                payload.sub,
            );
            expect(usersService.findByGoogleId).toHaveBeenNthCalledWith(
                2,
                payload.sub,
            );
            expect(result).toEqual({
                accessToken: 'access_token',
                refreshToken: 'refresh_token',
            });
        });

        it('should verify token and create new user if not found', async () => {
            clientMock.verifyIdToken.mockResolvedValue({
                getPayload: () => payload,
            });
            (usersService.findByGoogleId as jest.Mock).mockResolvedValue(null);
            (usersService.getUserByEmail as jest.Mock).mockResolvedValue(null);
            (usersService.createUserGoogle as jest.Mock).mockResolvedValue(
                user,
            );
            (tokenService.generateAccessToken as jest.Mock).mockResolvedValue(
                'access_token',
            );
            (
                tokenService.generateAndStoreRefreshToken as jest.Mock
            ).mockResolvedValue('refresh_token');

            const result = await service.loginWithGoogle(idToken);

            expect(usersService.createUserGoogle).toHaveBeenCalledWith({
                googleId: payload.sub,
                email: payload.email,
                name: payload.name,
            });
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
