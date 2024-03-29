import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/User';

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
