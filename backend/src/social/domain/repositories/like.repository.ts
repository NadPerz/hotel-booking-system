//like.repository.ts

import { Like } from '../entities/like.entity';

export abstract class LikeRepository {
  abstract likePost(like: Like, session?: any): Promise<Like>;
  abstract unlikePost(like: Like, session?: any): Promise<void>;
  abstract findByUserAndPost(
    userId: string,
    postId: string,
    session?: any,
  ): Promise<Like | null>;

  // 🆕 NEW: Transaction management methods
  abstract likePostWithTransaction<T>(
    like: Like,
    operation: (session: any) => Promise<T>,
  ): Promise<T>;

  abstract unlikePostWithTransaction<T>(
    like: Like,
    operation: (session: any) => Promise<T>,
  ): Promise<T>;
}
