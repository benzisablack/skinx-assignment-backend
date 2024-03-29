import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/User';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should be find by username success', async () => {
    const mockUser: User = {
      id: 1,
      username: 'test_user',
      passwordHash: 'test_password',
      salt: 'test_salt',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser);
    const actualResult = await userService.findByUsername('test_user');
    expect(actualResult).toEqual(mockUser);
  });
});
