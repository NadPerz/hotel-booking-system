import { Injectable } from '@nestjs/common';
import { LikeRepository } from 'src/social/domain/repositories/like.repository';
import { LikeDocument } from '../schemas/like.schema';
import { Like } from 'src/social/domain/entities/like.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PostRepository } from 'src/social/domain/repositories/post.repository';

@Injectable()
export class LikeRepositoryImpl extends LikeRepository {
  /**
   * Create a new LikeRepositoryImpl.
   *
   * @param likeModel - Mongoose model for Like documents (injected via @InjectModel).
   * @param postRepository - Domain-level repository for Post aggregate operations.
   */
  constructor(
    @InjectModel(Like.name) // Inject the Mongoose model for Like collection
    private readonly likeModel: Model<LikeDocument>,
    private readonly postRepository: PostRepository,
  ) {
    super();
  }

  //   async likePost(like: Like): Promise<Like> {
  //     // Create new MongoDB document with post content
  //     const doc = new this.likeModel({
  //       user: like.user,
  //       post: like.post,
  //     });

  //     // Save document to database
  //     const saved = await doc.save();

  //     // Convert MongoDB document back to domain entity
  //     return this.toDomainEntity(saved);
  //   }

  /**
   * Persist a Like and update the corresponding Post in a single transaction.
   *
   * Domain intent: create a Like aggregate and reflect that change in the Post aggregate
   * (e.g., push like id and increment like count). Both operations must be atomic.
   *
   * @param like - Domain Like entity to persist.
   * @returns Promise<Like> - The persisted Like as a domain entity.
   * @throws Error - Re-throws underlying DB errors; caller should map to application-level errors if needed.
   *
   */
  async likePost(like: Like): Promise<Like> {
    // Use a transaction to ensure both operations succeed or fail together
    const session = await this.likeModel.db.startSession();

    try {
      session.startTransaction();

      console.log(
        `DEBUG: Like entity data - user: ${like.user}, post: ${like.post}`,
      );
      console.log(`DEBUG: Like entity full object:`, like);

      // Create new MongoDB document with post content
      const doc = new this.likeModel({
        user: new Types.ObjectId(like.user),
        post: new Types.ObjectId(like.post),
      });

      console.log(`DEBUG: MongoDB document being saved:`, {
        user: doc.user,
        post: doc.post,
      });

      // Save like document to database
      const saved = await doc.save({ session });

      // Add like reference to post and increment count in one operation
      await this.postRepository.addLike(
        like.post,
        saved._id.toString(),
        session,
      );

      await session.commitTransaction();

      console.log(`Successfully liked post ${like.post} by user ${like.user}
        Currently in like.repository.impl.ts`);

      // Convert MongoDB document back to domain entity
      return this.toDomainEntity(saved);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Remove a Like created by userId on postId and update the Post aggregate accordingly.
   *
   * The deletion and the post update should be executed within the same database transaction.
   *
   * @param userId - ID of the user removing the like (string).
   * @param postId - ID of the post to unlike (string).
   * @returns Promise<void> - resolves if the operation completes; throws on error.
   */
  async unlikePost(like: Like): Promise<void> {
    const session = await this.likeModel.db.startSession();

    try {
      session.startTransaction();

      console.log(
        `DEBUG: Attempting to delete like with user: ${like.user}, post: ${like.post}`,
      );

      // Convert string IDs to ObjectId for the query
      const query = {
        user: new Types.ObjectId(like.user),
        post: new Types.ObjectId(like.post),
      };

      console.log(`DEBUG: Query object:`, query);

      // First, let's check if the document exists
      const existingLike = await this.likeModel.findOne(query).session(session);
      console.log(`DEBUG: Found existing like:`, existingLike);

      if (!existingLike) {
        console.log(`DEBUG: No like found to delete`);
        await session.commitTransaction();
        return;
      }

      // Remove the like
      const result = await this.likeModel.findOneAndDelete(query, { session });

      console.log(`DEBUG: Delete result:`, result);

      if (result) {
        // Remove like reference from post and decrement count

        console.log(
          `DEBUG: Calling removeLike with postId: ${like.post}, likeId: ${result._id.toString()}`,
        );

        await this.postRepository.removeLike(
          like.post,
          result._id.toString(),
          session,
        );
      } else {
        console.log(`DEBUG: No document was deleted`);
      }

      await session.commitTransaction();

      console.log(`Successfully un-liked post ${like.post} by user ${like.user}
        Currently in like.repository.impl.ts`);
    } catch (error) {
      console.error(`DEBUG: Error in unlikePost:`, error);

      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Map a persistence document to the domain entity.
   *
   * Keeps persistence concerns (ObjectId, mongoose methods) inside the infrastructure layer.
   *
   * @param doc - Mongoose LikeDocument.
   * @returns Like - Domain entity instance.
   */ private toDomainEntity(doc: LikeDocument): Like {
    return new Like(
      doc._id.toString(),
      doc.user.toString(),
      doc.post.toString(),
      doc.createdAt,
      doc.updatedAt,
    );
  }
}
