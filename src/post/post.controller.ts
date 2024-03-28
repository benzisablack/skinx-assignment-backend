import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { PageOptionsDto } from 'src/dto/page-options.dto';
import { Public } from '../decorators/public.decorator';
import { PageDto } from '../dto/page.dto';
import { Post } from '../entity/Post';
import { PostService } from '../post/post.service';

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

  @Public()
  @Get('/get-tags')
  async getTagsList() {
    return await this.postService.findAllTag();
  }
}
