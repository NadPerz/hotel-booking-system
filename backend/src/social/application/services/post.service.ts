import { Injectable } from '@nestjs/common';

@Injectable()
export class PostService {
  // constructor (private readonly postRepository: PostRepository)

  async create() {
    console.log('Create in postservice');
  }
}
