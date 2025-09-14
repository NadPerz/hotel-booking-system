import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreatePostDto } from '@shared/types/social/create-post.dto';
import { PostService } from 'src/social/application/services/post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    console.log('Jimiji post created');

    return await this.postService.create(createPostDto);
  }

  @Get()
  async getAllPosts() {
    console.log('getting posts');

    return await this.postService.getAll();
  }
}
