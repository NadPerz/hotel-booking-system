import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/social/domain/entities/post.entity';
import { PostRepository } from 'src/social/domain/repositories/post.repository';
import { PostDocument } from '../schemas/post.schema';

@Injectable()
export class PostRepositoryImpl extends PostRepository {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
  ) {
    super();
  }

  async create(post: Post): Promise<Post> {
    const doc = new this.postModel({
      content: post.content,
    });

    const saved = await doc.save();
    return this.toDomainEntity(saved);
  }

  private toDomainEntity(doc: PostDocument): Post {
    return new Post(
      doc._id.toString(),
      doc.content ?? '', //If undefined, it will return empty string
      doc.createdAt,
      doc.updatedAt,
    );
  }
}
