import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
          },
        },
      ],
      controllers: [AuthController],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should be sign in success', async () => {
    const mockResult = {
      access_token: 'test',
    };

    jest.spyOn(authService, 'signIn').mockResolvedValueOnce(mockResult);

    const actualResult = await authController.login({
      username: 'username',
      password: 'password',
    });
    expect(actualResult).toEqual(mockResult);
  });
});
