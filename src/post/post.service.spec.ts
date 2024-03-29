import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../constants';
import { PageMetaDto } from '../dto/page-meta.dto';
import { PageOptionsDto } from '../dto/page-options.dto';
import { PageDto } from '../dto/page.dto';
import { Post } from '../entity/Post';
import { Tag } from '../entity/Tag';
import { PostService } from './post.service';
describe('PostService', () => {
  let postService: PostService;
  let postRepository: Repository<Post>;
  let tagRepository: Repository<Tag>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(Post),
          useClass: Repository,
          useValue: {
            findAndCount: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Tag),
          useClass: Repository,
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    postService = module.get<PostService>(PostService);
    postRepository = module.get<Repository<Post>>(getRepositoryToken(Post));
    tagRepository = module.get<Repository<Tag>>(getRepositoryToken(Tag));
  });

  it('should be defined', () => {
    expect(postService).toBeDefined();
  });

  it('should be find all success', async () => {
    const mockPost: Post[] = [
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

    const mockValue: [Post[], number] = [mockPost, 1];

    const pageMetaDto = new PageMetaDto({
      itemCount: 1,
      pageOptionsDto,
    });

    const expectResult = new PageDto(mockPost, pageMetaDto);
    jest.spyOn(postRepository, 'findAndCount').mockResolvedValueOnce(mockValue);
    const actualResult = await postService.findAll(pageOptionsDto);
    expect(actualResult).toEqual(expectResult);
  });

  it('should be get all tags success', async () => {
    const mockTag: Tag[] = [
      {
        id: 1,
        name: 'test',
        posts: [],
      },
      {
        id: 2,
        name: 'test-2',
        posts: [],
      },
    ];

    jest.spyOn(tagRepository, 'find').mockResolvedValueOnce(mockTag);

    const actualResult = await postService.findAllTag();
    expect(actualResult).toEqual(mockTag);
  });
});
