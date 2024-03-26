import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tag } from './Tag';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({
    name: 'posted_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  postedAt: Date;

  @Column({ name: 'posted_by' })
  postedBy: string;

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];
}
