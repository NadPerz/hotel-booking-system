import { Controller, Post } from '@nestjs/common';
import { PostService } from 'src/social/application/services/post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async create() {
    console.log('Jimiji post created');

    return await this.postService.create();
  }
}
