import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/User';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private postRepository: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.postRepository.findOne({
      where: {
        username: username,
      },
    });
  }
}
