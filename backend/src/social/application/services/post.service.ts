import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '@shared/types/social/create-post.dto';
import { Post } from 'src/social/domain/entities/post.entity';
import { PostRepository } from 'src/social/domain/repositories/post.repository';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const post = new Post(
      'null', //will be given by db
      createPostDto?.content ?? '',
    );

    // content: dto?.content || "",   // fallback to blank string
    // author: dto?.author || "Anonymous"

    console.log('Create in postservice');

    return await this.postRepository.create(post);
  }
}
