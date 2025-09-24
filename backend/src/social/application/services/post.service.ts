//post.service.ts

import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from '@shared/types/social/create-post.dto';
import {
  Post,
  PostWithLikeStatus,
} from 'src/social/domain/entities/post.entity';
import { PostRepository } from 'src/social/domain/repositories/post.repository';
import { CommentRepository } from 'src/social/domain/repositories/comment.repository';
import { LikeRepository } from 'src/social/domain/repositories/like.repository';
import { StorageApplicationService } from 'src/shared/kernel/storage/application/services/storage.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

/**
 * Service class for managing post operations.
 * Provides business logic for creating and retrieving posts.
 */
@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    private readonly postRepository: PostRepository,
    private readonly commentRepository: CommentRepository,
    private readonly likeRepository: LikeRepository,
    private readonly storageService: StorageApplicationService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  /**
   * Creates a new post with the provided content and user information.
   *
   * @param createPostDto - Data transfer object containing post creation data
   * @returns Promise resolving to the created post entity
   * @throws Error if the creation operation fails
   */
  async create(createPostDto: CreatePostDto): Promise<Post> {
    this.logger.log(
      `[PostService.create] Creating post for user ${createPostDto.user}`,
    );

    const post = new Post(
      'null', // post Id will be given by db
      createPostDto.user,
      createPostDto?.content ?? '',
      undefined, // likeCount
      undefined, // commentCount
      undefined, // createdAt
      undefined, // updatedAt
      createPostDto.image ?? undefined, //kept for backwards compatibility
      createPostDto.mediaFiles ?? [],
    );

    // content: dto?.content || "",   // fallback to blank string
    // author: dto?.author || "Anonymous"

    return await this.postRepository.create(post);
  }

  /**
   * Retrieves all posts from the system.
   *
   * @returns Promise resolving to an array of all post entities
   * @throws Error if the retrieval operation fails
   */
  async getAll(): Promise<Post[]> {
    this.logger.log(`[PostService.getAll] Fetching all posts`);
    return await this.postRepository.getAll();
  }

  /**
   * Retrieves all posts with like status for a specific user.
   * Delegates to repository layer for efficient data retrieval.
   *
   * @param userId - Optional user ID to check like status
   * @returns Promise resolving to an array of PostWithLikeStatus entities
   * @throws Error if the retrieval operation fails
   */
  async getAllWithLikeStatus(userId?: string): Promise<PostWithLikeStatus[]> {
    this.logger.log(
      `[PostService.getAllWithLikeStatus] Fetching posts with like status for user: ${userId || 'anonymous'}`,
    );

    // Delegate to repository layer - this keeps the complex logic in infrastructure
    return await this.postRepository.getAllWithLikeStatus(userId);
  }

  /**
   * Deletes a post and cascades removal of related likes, comments, and media files.
   * Uses proper MongoDB transactions for data consistency.
   */
  async delete(postId: string, userId: string): Promise<void> {
    this.logger.log(
      `[PostService.delete] Deleting post ${postId} by user ${userId}`,
    );

    if (!postId || !userId) {
      throw new Error('Post ID and User ID are required');
    }

    // Start a MongoDB session for transaction
    const session = await this.connection.startSession();
    let mediaToDelete: string[] = [];

    try {
      await session.withTransaction(async () => {
        // 1. First, get the post to verify ownership and get media info
        const post = await this.postRepository.findById(postId, session);
        if (!post) {
          throw new NotFoundException(`Post with ID ${postId} not found`);
        }

        // 2. Verify ownership (basic authorization)
        if (post.user !== userId) {
          throw new ForbiddenException('You can only delete your own posts');
        }

        // 3. Store media files to delete after transaction succeeds
        if (post.image) {
          mediaToDelete.push(post.image);
        }

        // 3a. same as above, but if multiple media files exist
        if (post.mediaFiles && post.mediaFiles.length > 0) {
          mediaToDelete.push(...post.mediaFiles);
        }

        // 4. Delete related comments
        await this.deletePostComments(postId, session);

        // 5. Delete related likes
        await this.deletePostLikes(postId, session);

        // 6. Delete the post itself
        await this.postRepository.delete(postId, session);
      });

      // Transaction committed successfully, now delete media files
      if (mediaToDelete.length > 0) {
        await this.deleteMediaFiles(mediaToDelete);
      }
    } catch (error) {
      this.logger.error(`[PostService.delete] Transaction failed`, error.stack);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  /**
   * Deletes all comments associated with a post.
   */
  private async deletePostComments(
    postId: string,
    session: any,
  ): Promise<void> {
    try {
      // Use the proper repository method instead of casting
      if (typeof this.commentRepository['deleteManyByPost'] === 'function') {
        await (this.commentRepository as any).deleteManyByPost(postId, session);
        this.logger.debug(
          `[PostService.deletePostComments] Deleted comments for post ${postId}`,
        );
      } else {
        this.logger.warn(
          `[PostService.deletePostComments] deleteManyByPost method not available on CommentRepository`,
        );
        // Fallback: could implement a manual deletion here if needed
      }
    } catch (error) {
      this.logger.error(
        `[PostService.deletePostComments] Failed to delete comments for post ${postId}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Deletes all likes associated with a post.
   */
  private async deletePostLikes(postId: string, session: any): Promise<void> {
    try {
      // Use the proper repository method instead of casting
      if (typeof this.likeRepository['deleteManyByPost'] === 'function') {
        await (this.likeRepository as any).deleteManyByPost(postId, session);
        this.logger.debug(
          `[PostService.deletePostLikes] Deleted likes for post ${postId}`,
        );
      } else {
        this.logger.warn(
          `[PostService.deletePostLikes] deleteManyByPost method not available on LikeRepository`,
        );
        // Fallback: could implement a manual deletion here if needed
      }
    } catch (error) {
      this.logger.error(
        `[PostService.deletePostLikes] Failed to delete likes for post ${postId}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Deletes media files from storage.
   * This is done after the database transaction to avoid rollback issues.
   */
  private async deleteMediaFiles(mediaUrls: string[]): Promise<void> {
    this.logger.log(
      `[PostService.deleteMediaFiles] Deleting ${mediaUrls.length} media files`,
    );

    for (const mediaUrl of mediaUrls) {
      try {
        if (mediaUrl && mediaUrl.trim()) {
          await this.storageService.deleteFile(mediaUrl);
          this.logger.debug(
            `[PostService.deleteMediaFiles] Deleted media file: ${mediaUrl}`,
          );
        }
      } catch (error) {
        // Log error but don't fail the entire operation
        // Media cleanup is less critical than data consistency
        this.logger.error(
          `[PostService.deleteMediaFiles] Failed to delete media file: ${mediaUrl}`,
          error.stack,
        );
      }
    }
  }

  /**
   * Enhanced method for handling multiple media files per post
   */
  private async deleteMultipleMediaFiles(mediaKeys: string[]): Promise<void> {
    this.logger.log(
      `[PostService.deleteMultipleMediaFiles] Deleting ${mediaKeys.length} media files`,
    );

    const deletePromises = mediaKeys.map(async (mediaKey) => {
      try {
        if (mediaKey && mediaKey.trim()) {
          await this.storageService.deleteFile(mediaKey);
          this.logger.debug(
            `[PostService.deleteMultipleMediaFiles] Deleted media file: ${mediaKey}`,
          );
        }
      } catch (error) {
        this.logger.error(
          `[PostService.deleteMultipleMediaFiles] Failed to delete media file: ${mediaKey}`,
          error.stack,
        );
      }
    });

    // Execute all deletions in parallel but don't fail if some fail
    await Promise.allSettled(deletePromises);
  }

  /**
   * Deletes a post and cascades removal of related likes and comments in a transaction.
   */
  // async delete(postId: string, userId: string): Promise<void> {
  //   this.logger.log(
  //     `[PostService.delete] Deleting post ${postId} by user ${userId}`,
  //   );

  //   // Basic guards; later replace with proper Nest exceptions
  //   if (!postId || !userId) {
  //     throw new Error('Post ID and User ID are required');
  //   }

  //   // Use the like repository's transaction helper since it exists; otherwise we would need a generic one.
  //   // We'll piggyback on a like transaction with a no-op like entity pattern.
  //   await this.likeRepository.unlikePostWithTransaction(
  //     // dummy like entity for session; repositories ignore its content for our ops
  //     new (class {
  //       user = userId;
  //       post = postId;
  //     })() as any,
  //     async (session) => {
  //       // Authorization could be added here: fetch post and verify owner
  //       // Remove comments and likes for the post, then delete the post itself
  //       if ((this.commentRepository as any).deleteManyByPost) {
  //         await (this.commentRepository as any).deleteManyByPost(
  //           postId,
  //           session,
  //         );
  //       }
  //       if ((this.likeRepository as any).deleteManyByPost) {
  //         await (this.likeRepository as any).deleteManyByPost(postId, session);
  //       }
  //       if ((this.postRepository as any).delete) {
  //         await (this.postRepository as any).delete(postId, session);
  //       } else {
  //         throw new Error('PostRepository.delete is not implemented');
  //       }
  //     },
  //   );
  // }
}
