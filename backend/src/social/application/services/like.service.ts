//like.service.ts

import { Injectable } from '@nestjs/common';
import { LikePostDto } from '@shared/types/social/like-post.dto';
import { Like } from 'src/social/domain/entities/like.entity';
import { LikeRepository } from 'src/social/domain/repositories/like.repository';
import { PostRepository } from 'src/social/domain/repositories/post.repository';

/**
 * Service class for managing like operations on posts.
 * Coordinates between Like and Post repositories to maintain data consistency.
 */
@Injectable()
export class LikeService {
  constructor(
    private readonly likeRepository: LikeRepository,
    // 🆕 NEW: Inject PostRepository
    private readonly postRepository: PostRepository,
  ) {}

  /**
   * Creates a like on a post for the specified user.
   * Uses database transactions to ensure both the like record and post like count are updated atomically.
   *
   * @param likePostDto - Data transfer object containing user ID and post ID and other relevavnt details
   * @returns Promise resolving to the created like entity
   * @throws Error if the user has already liked the post or if the operation fails
   */
  async likePost(likePostDto: LikePostDto): Promise<Like> {
    console.log(`Attempting to like post ${likePostDto.post} by user ${likePostDto.user}
                     Currently in like.service.ts`);

    const like = new Like('null', likePostDto.user, likePostDto.post);

    try {
      // Use new transaction method and coordinate both operations
      const result = await this.likeRepository.likePostWithTransaction(
        like,
        async (session) => {
          // These callbacks get executed within the transaction

          // Create the like record
          const savedLike = await this.likeRepository.likePost(like, session);

          //update post like count
          await this.postRepository.addLike(
            likePostDto.post,
            savedLike.id,
            session,
          );
          return savedLike;
        },
      );

      console.log(
        `Successfully liked post ${likePostDto.post} by user ${likePostDto.user}`,
      );
      return result;
    } catch (error) {
      console.error(
        `[LikeService.likePost] Failed to like post - PostID: ${likePostDto.post}, UserID: ${likePostDto.user}`,
        {
          error: error.message,
          code: error.code,
        },
      );

      // Handle the duplicate key error specifically
      if (error.code === 11000) {
        throw new Error(
          `User ${likePostDto.user} has already liked post ${likePostDto.post}`,
        );
      }

      throw error;
    }
  }

  /**
   * Removes a like from a post for the specified user.
   * Uses database transactions to ensure both the like record removal and post like count update are atomic.
   *
   * @param likePostDto - Data transfer object containing user ID and post ID
   * @returns Promise resolving when the operation completes
   * @throws Error if the operation fails
   */
  async unlikePost(likePostDto: LikePostDto): Promise<void> {
    console.log(`Attempting to un-like post ${likePostDto.post} by user ${likePostDto.user}
                     Currently in like.service.ts`);

    const like = new Like('null', likePostDto.user, likePostDto.post);

    try {
      //Use transaction method and coordinate both operations
      await this.likeRepository.unlikePostWithTransaction(
        like,
        async (session) => {
          //Check if like exists
          const existingLike = await this.likeRepository.findByUserAndPost(
            likePostDto.user,
            likePostDto.post,
            session,
          );

          if (existingLike) {
            // Remove the like record
            await this.likeRepository.unlikePost(like, session);
            // Update post like count
            await this.postRepository.removeLike(
              likePostDto.post,
              existingLike.id,
              session,
            );
          }
        },
      );

      console.log(
        `Successfully un-liked post ${likePostDto.post} by user ${likePostDto.user}`,
      );
    } catch (error) {
      console.error(
        `[LikeService.unlikePost] Failed to unlike post - PostID: ${likePostDto.post}, UserID: ${likePostDto.user}`,
        {
          error: error.message,
          code: error.code,
        },
      );
      throw error;
    }
  }
}
