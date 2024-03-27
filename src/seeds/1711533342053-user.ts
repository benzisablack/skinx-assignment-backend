import * as bcrypt from 'bcrypt';
import { User } from 'src/entity/User';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class User1711533342053 implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    await dataSource.query('TRUNCATE "user" RESTART IDENTITY CASCADE;');

    const userRepository = dataSource.getRepository(User);

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('p@ssw0rd', salt);

    const savePost = new User();
    savePost.username = 'admin';
    savePost.passwordHash = hash;
    savePost.salt = salt;

    await userRepository.save(savePost);
  }
}
