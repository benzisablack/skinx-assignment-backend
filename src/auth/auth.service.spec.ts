import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entity/User';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByUsername: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should be sign in success', async () => {
    const mockUser: User = {
      id: 1,
      username: 'test_user',
      passwordHash: 'test_password',
      salt: 'test_salt',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const expectResult = {
      access_token: 'test_token',
    };

    jest.spyOn(userService, 'findByUsername').mockResolvedValueOnce(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    jest.spyOn(jwtService, 'signAsync').mockResolvedValue('test_token');
    const result = await authService.signIn('test', 'test');

    expect(result).toEqual(expectResult);
  });

  it('should be sign in failed due to not found username', async () => {
    jest.spyOn(userService, 'findByUsername').mockResolvedValueOnce(null);

    await expect(authService.signIn('test', 'test')).rejects.toEqual(
      new NotFoundException(),
    );
  });

  it('should be sign in failed due to password is not match', async () => {
    const mockUser: User = {
      id: 1,
      username: 'test_user',
      passwordHash: 'test_password',
      salt: 'test_salt',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(userService, 'findByUsername').mockResolvedValueOnce(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    await expect(authService.signIn('test', 'test')).rejects.toEqual(
      new UnauthorizedException(),
    );
  });
});
