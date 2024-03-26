import { Post } from 'src/entity/Post';
import { Tag } from 'src/entity/Tag';
import { DataSource, In } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import * as postsData from '../../posts.json';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    await dataSource.query('TRUNCATE "tag" RESTART IDENTITY CASCADE;');
    await dataSource.query('TRUNCATE "post" RESTART IDENTITY CASCADE;');
    await dataSource.query(
      'TRUNCATE "post_tags_tag" RESTART IDENTITY CASCADE;',
    );

    const uniqueTags = [
      ...new Set(
        Object.values(postsData)
          .map((post) => post.tags)
          .flat(),
      ),
    ];

    const tagRepository = dataSource.getRepository(Tag);
    for (const tag of uniqueTags) {
      await tagRepository.insert({
        name: tag,
      });
    }

    const postRepository = dataSource.getRepository(Post);
    for (const post of Object.values(postsData)) {
      const tags = await tagRepository.find({
        where: {
          name: In(post.tags),
        },
      });
      const savePost = new Post();
      savePost.title = post.title;
      savePost.content = post.content;
      savePost.postedBy = post.postedBy;
      savePost.postedAt = new Date(post.postedAt);
      savePost.tags = tags;

      await postRepository.save(savePost);
    }
  }
}
