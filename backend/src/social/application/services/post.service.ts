import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Post } from 'src/social/domain/entities/post.entity';

@Injectable()
export class PostService {
  // constructor (private readonly postRepository: PostRepository)

  async create(createPostDto: CreatePostDto) /*: Promise<Post>*/ {
    const post = new Post(
      'null', //will be given by db
      createPostDto.content,
    );

    console.log('Create in postservice');

    // return await this.postRepository.create(post);
  }
}
