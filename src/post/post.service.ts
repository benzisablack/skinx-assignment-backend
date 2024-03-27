import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageMetaDto, PageMetaDtoParameters } from 'src/dto/page-meta.dto';
import { PageOptionsDto } from 'src/dto/page-options.dto';
import { PageDto } from 'src/dto/page.dto';
import { SearchPostRequestDto } from 'src/dto/post/searchRequest.dto';
import { Post } from 'src/entity/Post';
import { In, Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<Post>> {
    const [items, itemCount] = await this.postRepository.findAndCount({
      relations: {
        tags: true,
      },
      order: {
        id: pageOptionsDto.order,
      },
      skip: (pageOptionsDto.page - 1) * pageOptionsDto.take,
      take: pageOptionsDto.take,
    });

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto,
    });

    return new PageDto(items, pageMetaDto);
  }

  async findById(id: number): Promise<Post | null> {
    return this.postRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        tags: true,
      },
    });
  }

  async findByTag(
    searchPostRequestDto: SearchPostRequestDto,
  ): Promise<PageDto<Post>> {
    const tagList = searchPostRequestDto.tags
      .split(',')
      .map((tag) => tag.trim());

    const [items, itemCount] = await this.postRepository.findAndCount({
      where: {
        tags: {
          name: In(tagList),
        },
      },
      relations: {
        tags: true,
      },
      order: {
        id: searchPostRequestDto.order,
      },
      skip: (searchPostRequestDto.page - 1) * searchPostRequestDto.take,
      take: searchPostRequestDto.take,
    });

    const pageMetaDtoParams: PageMetaDtoParameters = {
      pageOptionsDto: searchPostRequestDto,
      itemCount,
    };

    const pageMetaDto = new PageMetaDto(pageMetaDtoParams);

    return new PageDto(items, pageMetaDto);
  }
}
