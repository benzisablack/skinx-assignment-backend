import { Injectable } from '@nestjs/common';

@Injectable()
export class PostService {
  async findById(id: number): Promise<any> {
    return {
      id,
      title: 'title',
      content: 'content',
    };
  }
}
