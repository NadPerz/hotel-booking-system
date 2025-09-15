import { ClientSession } from 'mongoose';
import { Post } from '../entities/post.entity';

export abstract class PostRepository {
  abstract create(post: Post): Promise<Post>;
  abstract getAll(): Promise<Post[]>;

  //Method to add a like
  abstract addLike(
    postId: string,
    likeId: string,
    session?: ClientSession,
  ): Promise<void>;

  //Method to remove a like
  abstract removeLike(
    postId: string,
    likeId: string,
    session?: ClientSession,
  ): Promise<void>;
}
