import { Body, Controller, Post } from '@nestjs/common';
import { CreatePostDto } from 'src/social/application/dtos/create-post.dto';
import { PostService } from 'src/social/application/services/post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    console.log('Jimiji post created');

    return await this.postService.create(createPostDto);
  }
}
