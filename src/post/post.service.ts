import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageOptionsDto } from 'src/dto/page-options.dto';
import { Tag } from 'src/entity/Tag';
import { FindManyOptions, ILike, In, Repository } from 'typeorm';
import { PageMetaDto } from '../dto/page-meta.dto';
import { PageDto } from '../dto/page.dto';
import { Post } from '../entity/Post';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
  ) {}

  async findAll(pageOptionDto: PageOptionsDto): Promise<PageDto<Post>> {
    const findOptions: FindManyOptions = {
      order: {
        id: pageOptionDto.order,
      },
      where: {
        title: ILike(`%${pageOptionDto.search ?? ''}%`),
        ...(pageOptionDto.tags
          ? {
              tags: {
                id: In(pageOptionDto.tags.split(',').map((id) => Number(id))),
              },
            }
          : {}),
      },
      relations: {
        tags: true,
      },
      skip: (pageOptionDto.page - 1) * pageOptionDto.take,
      take: pageOptionDto.take,
    };

    const [items, itemCount] =
      await this.postRepository.findAndCount(findOptions);

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: pageOptionDto,
    });

    return new PageDto(items, pageMetaDto);
  }

  async findAllTag(): Promise<Tag[]> {
    return this.tagRepository.find();
  }
}
