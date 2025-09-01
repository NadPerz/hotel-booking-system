import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';

@Injectable()
export class PostService {
  // constructor (private readonly postRepository: PostRepository)

  async create(createDto: CreatePostDto) {
    console.log('Create in postservice');
  }
}
