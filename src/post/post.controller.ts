import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { PageOptionsDto } from 'src/dto/page-options.dto';
import { PageDto } from 'src/dto/page.dto';
import { SearchPostRequestDto } from 'src/dto/post/searchRequest.dto';
import { Post } from 'src/entity/Post';
import { PostService } from './post.service';

@Controller('v1/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Post>> {
    return await this.postService.findAll(pageOptionsDto);
  }

  @Get('/search')
  async getPostsByTags(@Query() searchPostRequestDto: SearchPostRequestDto) {
    return await this.postService.findByTag(searchPostRequestDto);
  }

  @Get('/:id')
  async getPosts(@Param('id') id: number) {
    return await this.postService.findById(id);
  }
}
