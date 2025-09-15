import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreatePostDto } from '@shared/types/social/create-post.dto';
import { PostService } from 'src/social/application/services/post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    console.log('post created');

    return await this.postService.create(createPostDto);
  }

  @Get()
  async getAllPosts() {
    console.log('Getting all posts');

    return await this.postService.getAll();
  }

  //Getting posts by user ID NOT IMPLEMENTED
  @Get('user/:userId')
  async getPostsByUserId(@Param('userId') userId: string) {
    console.log(`Getting posts for user: ${userId}.  NOT IMPLEMENTED`);
    // return await this.postService.getByUserId(userId);
  }

  //Getting posts by post ID NOT IMPLEMENTED
  @Get(':id')
  async getPostById(@Param('id') id: string) {
    console.log(`Getting post with ID: ${id}. NOT IMPLEMENTED`);
    // return await this.postService.getById(id);
  }
}
