//post.repository.impl.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Post } from 'src/social/domain/entities/post.entity';
import { PostRepository } from 'src/social/domain/repositories/post.repository';
import { PostDocument } from '../schemas/post.schema';

@Injectable()
export class PostRepositoryImpl extends PostRepository {
  constructor(
    @InjectModel(Post.name) // Inject the Mongoose model for Post collection
    private readonly postModel: Model<PostDocument>,
  ) {
    super();
  }

  async create(post: Post): Promise<Post> {
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

  async getAll(): Promise<Post[]> {
    // Query all posts from database, sorted by creation date (newest first)
    const docs = await this.postModel
      .find()
      .sort({ createdAt: -1 }) // Most recent first
      .exec();

    // Convert each MongoDB document to domain entity
    return docs.map((doc) => this.toDomainEntity(doc));
  }

  // 🔄 IMPROVED: Better session handling
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

  // 🔄 IMPROVED: Better session handling
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

  // async addLike(
  //   postId: string,
  //   likeId: string,
  //   session?: ClientSession,
  // ): Promise<void> {
  //   const options = session ? { session, new: true } : { new: true };

  //   await this.postModel
  //     .findByIdAndUpdate(
  //       postId,
  //       {
  //         $inc: { likeCount: 1 },
  //         $addToSet: { likes: likeId }, // $addToSet prevents duplicates
  //       },
  //       options,
  //     )
  //     .exec();
  // }

  // async removeLike(
  //   postId: string,
  //   likeId: string,
  //   session?: ClientSession,
  // ): Promise<void> {
  //   const options = session ? { session, new: true } : { new: true };

  //   await this.postModel
  //     .findByIdAndUpdate(
  //       postId,
  //       {
  //         $inc: { likeCount: -1 },
  //         $pull: { likes: likeId },
  //       },
  //       options,
  //     )
  //     .exec();
  // }
  // Helper method to convert MongoDB document to domain entity
  private toDomainEntity(doc: PostDocument): Post {
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
