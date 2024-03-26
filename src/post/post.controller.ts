import { Controller, Get, Param } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('v1/post')
export class PostController {
  constructor(private readonly _postService: PostService) {}

  @Get('/:id')
  async getPosts(@Param('id') id: number) {
    return await this._postService.findById(id);
  }
}
