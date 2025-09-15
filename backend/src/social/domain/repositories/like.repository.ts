import { Like } from '../entities/like.entity';

export abstract class LikeRepository {
  abstract likePost(like: Like): Promise<Like>;
  abstract unlikePost(like: Like): Promise<void>;
}
