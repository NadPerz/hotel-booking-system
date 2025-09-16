//post.repository.impl.ts

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Post } from 'src/social/domain/entities/post.entity';
import { PostRepository } from 'src/social/domain/repositories/post.repository';
import { PostDocument } from '../schemas/post.schema';

/**
 * MongoDB implementation of the PostRepository interface.
 * Handles database operations for Post entities using Mongoose.
 */
@Injectable()
export class PostRepositoryImpl extends PostRepository {
  private readonly logger = new Logger(PostRepositoryImpl.name);

  constructor(
    @InjectModel(Post.name) // Inject the Mongoose model for Post collection
    private readonly postModel: Model<PostDocument>,
  ) {
    super();
  }

  /**
   * Creates a new post record in the MongoDB collection.
   *
   * @param post - The post entity to create
   * @returns Promise resolving to the created post entity
   * @throws Error if the save operation fails
   */
  async create(post: Post): Promise<Post> {
    this.logger.log(
      `[PostRepositoryImpl.create] Creating new post for user ${post.user}`,
    );

    if (!post.user) {
      this.logger.error('Cannot create post: missing user ID', { post });
      throw new Error('User ID is required to create a post');
    }

    try {
      // Create new MongoDB document with post content
      const doc = new this.postModel({
        user: post.user,
        content: post.content,
      });

      //pre-save logging
      this.logger.debug('MongoDB document prepared for save', {
        userId: doc.user,
        hasContent: !!doc.content,
      });

      // Save document to database
      const saved = await doc.save();

      //success logging
      this.logger.log(`Post created successfully with ID: ${saved._id}`, {
        postId: saved._id,
        userId: saved.user,
      });

      // Convert MongoDB document back to domain entity
      return this.toDomainEntity(saved);
    } catch (error) {
      // error logging
      this.logger.error('Failed to create post', {
        userId: post.user,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  /**
   * Retrieves all posts from the MongoDB collection, sorted by creation date.
   *
   * @returns Promise resolving to an array of post entities
   * @throws Error if the query operation fails
   */
  async getAll(): Promise<Post[]> {
    this.logger.log(`[PostRepositoryImpl.getAll] Fetching posts from DB`);

    try {
      // Query all posts from database, sorted by creation date (newest first)
      const docs = await this.postModel
        .find()
        .sort({ createdAt: -1 }) // Most recent first
        .exec();

      // result logging
      this.logger.log(
        `Successfully retrieved ${docs.length} posts from database`,
      );

      // Convert each MongoDB document to domain entity
      return docs.map((doc) => this.toDomainEntity(doc));
    } catch (error) {
      // error logging
      this.logger.error('Failed to fetch posts from database', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  /**
   * Adds a like to a post by incrementing the like count and adding the like ID to the likes array.
   *
   * @param postId - The ID of the post to add the like to
   * @param likeId - The ID of the like to add
   * @param session - Optional MongoDB session for transaction support
   * @returns Promise resolving when the operation completes
   * @throws Error if the update operation fails
   */
  async addLike(
    postId: string,
    likeId: string,
    session?: ClientSession,
  ): Promise<void> {
    // method entry logging
    this.logger.debug(`Adding like to post`, {
      postId,
      likeId,
      hasSession: !!session,
    });

    try {
      // session options handling
      const updateOptions = session ? { session, new: true } : { new: true };

      const result = await this.postModel
        .findByIdAndUpdate(
          postId,
          {
            $inc: { likeCount: 1 },
            // $addToSet: { likes: likeId },
          },
          updateOptions,
        )
        .exec();

      if (result) {
        //success logging
        this.logger.log(`Successfully added like to post ${postId}`, {
          postId,
          likeId,
          newLikeCount: result.likeCount,
        });
      } else {
        // warning for non-existent post
        this.logger.warn(`Post not found when adding like`, { postId, likeId });
        throw new Error(`Post with ID ${postId} not found`);
      }
    } catch (error) {
      // error logging
      this.logger.error('Failed to add like to post', {
        postId,
        likeId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  /**
   * Removes a like from a post by decrementing the like count and removing the like ID from the likes array.
   *
   * @param postId - The ID of the post to remove the like from
   * @param likeId - The ID of the like to remove
   * @param session - Optional MongoDB session for transaction support
   * @returns Promise resolving when the operation completes
   * @throws Error if the update operation fails
   */
  async removeLike(
    postId: string,
    likeId: string,
    session?: ClientSession,
  ): Promise<void> {
    //  method entry logging
    this.logger.debug(`Removing like from post`, {
      postId,
      likeId,
      hasSession: !!session,
    });

    try {
      //session options handling
      const updateOptions = session ? { session, new: true } : { new: true };

      const result = await this.postModel
        .findByIdAndUpdate(
          postId,
          {
            $inc: { likeCount: -1 },
            // $pull: { likes: likeId },
          },
          updateOptions,
        )
        .exec();

      if (result) {
        //success logging
        this.logger.log(`Successfully removed like from post ${postId}`, {
          postId,
          likeId,
          newLikeCount: Math.max(0, result.likeCount - 1),
        });
      } else {
        // warning for non-existent post
        this.logger.warn(`Post not found when removing like`, {
          postId,
          likeId,
        });
        throw new Error(`Post with ID ${postId} not found`);
      }
    } catch (error) {
      // error logging
      this.logger.error('Failed to remove like from post', {
        postId,
        likeId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  /**
   * Increments the comment count for a post when a new comment is added.
   *
   * @param postId - The ID of the post to add the comment to
   * @param commentId - The ID of the new comment
   * @param session - Optional MongoDB session for transaction support
   */
  async addComment(
    postId: string,
    commentId: string,
    session?: ClientSession,
  ): Promise<void> {
    this.logger.debug(`Adding comment to post`, {
      postId,
      commentId,
      hasSession: !!session,
    });

    try {
      const updateOptions = session ? { session, new: true } : { new: true };

      const result = await this.postModel
        .findByIdAndUpdate(
          postId,
          {
            $inc: { commentCount: 1 },
          },
          updateOptions,
        )
        .exec();

      if (result) {
        this.logger.log(`Successfully added comment to post ${postId}`, {
          postId,
          commentId,
          newCommentCount: result.commentCount,
        });
      } else {
        this.logger.warn(`Post not found when adding comment`, {
          postId,
          commentId,
        });
        throw new Error(`Post with ID ${postId} not found`);
      }
    } catch (error) {
      this.logger.error('Failed to add comment to post', {
        postId,
        commentId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  /**
   * Decrements the comment count for a post when a comment is removed.
   *
   * @param postId - The ID of the post to remove the comment from
   * @param commentId - The ID of the comment being removed
   * @param session - Optional MongoDB session for transaction support
   */
  async removeComment(
    postId: string,
    commentId: string,
    session?: ClientSession,
  ): Promise<void> {
    this.logger.debug(`Removing comment from post`, {
      postId,
      commentId,
      hasSession: !!session,
    });

    try {
      const updateOptions = session ? { session, new: true } : { new: true };

      const result = await this.postModel
        .findByIdAndUpdate(
          postId,
          {
            $inc: { commentCount: -1 },
          },
          updateOptions,
        )
        .exec();

      if (result) {
        this.logger.log(`Successfully removed comment from post ${postId}`, {
          postId,
          commentId,
          newCommentCount: Math.max(0, result.commentCount - 1),
        });
      } else {
        this.logger.warn(`Post not found when removing comment`, {
          postId,
          commentId,
        });
        throw new Error(`Post with ID ${postId} not found`);
      }
    } catch (error) {
      this.logger.error('Failed to remove comment from post', {
        postId,
        commentId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  /**
   * Converts a MongoDB document to a domain entity.
   *
   * @private
   * @param doc - The MongoDB document to convert
   * @returns The corresponding domain entity
   */ private toDomainEntity(doc: PostDocument): Post {
    return new Post(
      doc._id.toString(),
      doc.user.toString(),
      doc.content ?? '', //If undefined, it will return empty string
      doc.likeCount ?? 0,
      doc.commentCount ?? 0,
      doc.createdAt,
      doc.updatedAt,
    );
  }
}
