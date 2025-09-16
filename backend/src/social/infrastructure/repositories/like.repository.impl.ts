//like.repository.impl.ts

import { Injectable } from '@nestjs/common';
import { LikeRepository } from 'src/social/domain/repositories/like.repository';
import { LikeDocument } from '../schemas/like.schema';
import { Like } from 'src/social/domain/entities/like.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, ClientSession } from 'mongoose';

/**
 * MongoDB implementation of the LikeRepository interface.
 * Handles database operations for Like entities using Mongoose.
 */
@Injectable()
export class LikeRepositoryImpl extends LikeRepository {
  constructor(
    @InjectModel(Like.name)
    private readonly likeModel: Model<LikeDocument>,
  ) {
    super();
  }

  /**
   * Executes a like operation within a MongoDB transaction.
   * Handles session management, transaction lifecycle, and error handling.
   *
   * @template T - The return type of the operation
   * @param like - The like entity involved in the transaction
   * @param operation - The callback function to execute within the transaction
   * @returns Promise resolving to the result of the operation
   * @throws Error if transaction fails or duplicate key error occurs
   */
  async likePostWithTransaction<T>(
    like: Like,
    operation: (session: any) => Promise<T>,
  ): Promise<T> {
    console.log(
      `[LikeRepositoryImpl.likePostWithTransaction] Starting transaction for PostID: ${like.post}, UserID: ${like.user}`,
    );

    const session = await this.likeModel.db.startSession();

    try {
      session.startTransaction();
      console.log(
        `[LikeRepositoryImpl.likePostWithTransaction] Transaction started`,
      );

      const result = await operation(session);

      await session.commitTransaction();
      console.log(
        `[LikeRepositoryImpl.likePostWithTransaction] Transaction committed successfully`,
      );

      return result;
    } catch (error) {
      console.error(
        `[LikeRepositoryImpl.likePostWithTransaction] Transaction failed, rolling back`,
        {
          postId: like.post,
          userId: like.user,
          error: error.message,
          code: error.code,
        },
      );

      await session.abortTransaction();

      // Handle duplicate key error at repository level
      if (error.code === 11000) {
        throw new Error(
          `User ${like.user} has already liked post ${like.post}`,
        );
      }
      throw error;
    } finally {
      session.endSession();
      console.log(`[LikeRepositoryImpl.likePostWithTransaction] Session ended`);
    }
  }

  /**
   * Executes an unlike operation within a MongoDB transaction.
   * Handles session management, transaction lifecycle, and error handling.
   *
   * @template T - The return type of the operation
   * @param like - The like entity involved in the transaction
   * @param operation - The callback function to execute within the transaction
   * @returns Promise resolving to the result of the operation
   * @throws Error if transaction fails
   */
  async unlikePostWithTransaction<T>(
    like: Like,
    operation: (session: any) => Promise<T>,
  ): Promise<T> {
    console.log(
      `[LikeRepositoryImpl.unlikePostWithTransaction] Starting transaction for PostID: ${like.post}, UserID: ${like.user}`,
    );

    const session = await this.likeModel.db.startSession();

    try {
      session.startTransaction();
      console.log(
        `[LikeRepositoryImpl.unlikePostWithTransaction] Transaction started`,
      );

      const result = await operation(session);

      await session.commitTransaction();
      console.log(
        `[LikeRepositoryImpl.unlikePostWithTransaction] Transaction committed successfully`,
      );

      return result;
    } catch (error) {
      console.error(
        `[LikeRepositoryImpl.unlikePostWithTransaction] Transaction failed, rolling back`,
        {
          postId: like.post,
          userId: like.user,
          error: error.message,
          code: error.code,
        },
      );

      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
      console.log(
        `[LikeRepositoryImpl.unlikePostWithTransaction] Session ended`,
      );
    }
  }

  /**
   * Creates a new like record in the MongoDB collection.
   *
   * @param like - The like entity to create
   * @param session - Optional MongoDB session for transaction support
   * @returns Promise resolving to the created like entity
   * @throws Error if the save operation fails
   */
  async likePost(like: Like, session?: ClientSession): Promise<Like> {
    console.log(
      `[LikeRepositoryImpl.likePost] Creating like record - UserID: ${like.user}, PostID: ${like.post}`,
    );

    // Create new MongoDB document
    const doc = new this.likeModel({
      user: new Types.ObjectId(like.user),
      post: new Types.ObjectId(like.post),
    });

    console.log(`[LikeRepositoryImpl.likePost] MongoDB document prepared`, {
      userObjectId: doc.user.toString(),
      postObjectId: doc.post.toString(),
      hasSession: !!session,
    });

    // Save with optional session
    const saved = await doc.save(session ? { session } : {});

    console.log(
      `[LikeRepositoryImpl.likePost] Like document saved successfully with ID: ${saved._id}`,
    );

    // Convert MongoDB document back to domain entity
    return this.toDomainEntity(saved);
  }

  /**
   * Removes a like record from the MongoDB collection.
   *
   * @param like - The like entity to remove
   * @param session - Optional MongoDB session for transaction support
   * @returns Promise resolving when the operation completes
   */
  async unlikePost(like: Like, session?: ClientSession): Promise<void> {
    console.log(
      `[LikeRepositoryImpl.unlikePost] Removing like record - UserID: ${like.user}, PostID: ${like.post}`,
    );

    // Convert string IDs to ObjectId for the query
    const query = {
      user: new Types.ObjectId(like.user),
      post: new Types.ObjectId(like.post),
    };

    console.log(`[LikeRepositoryImpl.unlikePost] Query prepared`, {
      userObjectId: query.user.toString(),
      postObjectId: query.post.toString(),
      hasSession: !!session,
    });

    // Remove with optional session
    const result = await this.likeModel.findOneAndDelete(
      query,
      session ? { session } : {},
    );

    if (result) {
      console.log(
        `[LikeRepositoryImpl.unlikePost] Like document removed successfully - ID: ${result._id}`,
      );
    } else {
      console.log(
        `[LikeRepositoryImpl.unlikePost] No like document found to remove`,
      );
    }
  }

  /**
   * Finds a like record by user ID and post ID.
   *
   * @param userId - The ID of the user who liked the post
   * @param postId - The ID of the post that was liked
   * @param session - Optional MongoDB session for transaction support
   * @returns Promise resolving to the like entity if found, null otherwise
   */
  async findByUserAndPost(
    userId: string,
    postId: string,
    session?: ClientSession,
  ): Promise<Like | null> {
    console.log(
      `[LikeRepositoryImpl.findByUserAndPost] Searching for like - UserID: ${userId}, PostID: ${postId}`,
    );

    const query = {
      user: new Types.ObjectId(userId),
      post: new Types.ObjectId(postId),
    };

    const doc = await this.likeModel.findOne(
      query,
      null,
      session ? { session } : {},
    );

    if (doc) {
      console.log(
        `[LikeRepositoryImpl.findByUserAndPost] Like found with ID: ${doc._id}`,
      );
      return this.toDomainEntity(doc);
    } else {
      console.log(
        `[LikeRepositoryImpl.findByUserAndPost] No like found for UserID: ${userId}, PostID: ${postId}`,
      );
      return null;
    }
  }

  /**
   * Converts a MongoDB document to a domain entity.
   *
   * @private
   * @param doc - The MongoDB document to convert
   * @returns The corresponding domain entity
   */
  private toDomainEntity(doc: LikeDocument): Like {
    return new Like(
      doc._id.toString(),
      doc.user.toString(),
      doc.post.toString(),
      doc.createdAt,
      doc.updatedAt,
    );
  }
}
