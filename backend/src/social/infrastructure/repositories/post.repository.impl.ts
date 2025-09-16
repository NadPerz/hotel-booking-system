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

    // Create new MongoDB document with post content
    const doc = new this.postModel({
      user: post.user,
      content: post.content,
    });

    // Save document to database
    const saved = await doc.save();

    // Convert MongoDB document back to domain entity
    return this.toDomainEntity(saved);
  }

  /**
   * Retrieves all posts from the MongoDB collection, sorted by creation date.
   *
   * @returns Promise resolving to an array of post entities
   * @throws Error if the query operation fails
   */
  async getAll(): Promise<Post[]> {
    this.logger.log(`[PostRepositoryImpl.getAll] Fetching posts from DB`);

    // Query all posts from database, sorted by creation date (newest first)
    const docs = await this.postModel
      .find()
      .sort({ createdAt: -1 }) // Most recent first
      .exec();

    // Convert each MongoDB document to domain entity
    return docs.map((doc) => this.toDomainEntity(doc));
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
    // 🔄 IMPROVED: Cleaner session options handling
    const updateOptions = session ? { session, new: true } : { new: true };

    await this.postModel
      .findByIdAndUpdate(
        postId,
        {
          $inc: { likeCount: 1 },
          // $addToSet: { likes: likeId },
        },
        updateOptions,
      )
      .exec();
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
    // 🔄 IMPROVED: Cleaner session options handling
    const updateOptions = session ? { session, new: true } : { new: true };

    await this.postModel
      .findByIdAndUpdate(
        postId,
        {
          $inc: { likeCount: -1 },
          // $pull: { likes: likeId },
        },
        updateOptions,
      )
      .exec();
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
      doc.createdAt,
      doc.updatedAt,
    );
  }
}
