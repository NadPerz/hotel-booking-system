import { Post } from '../entities/post.entity';

export abstract class PostRepository {
  abstract create(post: Post): Promise<Post>;
  abstract getAll(): Promise<Post[]>;
}
