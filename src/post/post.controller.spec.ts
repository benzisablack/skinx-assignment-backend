import { Test, TestingModule } from '@nestjs/testing';
import { Order } from '../../constants';
import { PageMetaDto } from '../../src/dto/page-meta.dto';
import { PageOptionsDto } from '../../src/dto/page-options.dto';
import { PageDto } from '../../src/dto/page.dto';
import { Post } from '../../src/entity/Post';
import { PostController } from './post.controller';
import { PostService } from './post.service';

describe('PostController', () => {
  let postController: PostController;
  let postService: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PostService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
      controllers: [PostController],
    }).compile();

    postController = module.get<PostController>(PostController);
    postService = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(postController).toBeDefined();
  });

  it('should be get all post success', async () => {
    const mockResponse: Post[] = [
      {
        id: 1,
        title: 'test title',
        content: '<p>test content</p>',
        postedBy: 'test user',
        postedAt: new Date(),
        tags: [
          {
            id: 1,
            name: 'test tag',
            posts: [],
          },
        ],
      },
    ];

    const pageOptionsDto: PageOptionsDto = {
      page: 1,
      take: 10,
      order: Order.ASC,
      skip: 0,
    };

    const pageMetaDto = new PageMetaDto({
      itemCount: 1,
      pageOptionsDto,
    });

    const expectResult = new PageDto(mockResponse, pageMetaDto);

    jest.spyOn(postService, 'findAll').mockResolvedValueOnce(expectResult);

    const actualResult = await postController.getAll(pageOptionsDto);
    expect(actualResult).toEqual(expectResult);
  });
});
