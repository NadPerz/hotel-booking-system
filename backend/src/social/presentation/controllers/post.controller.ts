//post.controller.ts

import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { CreatePostDto } from '@shared/types/social/create-post.dto';
import { PostService } from 'src/social/application/services/post.service';

@Controller('posts')
export class PostController {
  private readonly logger = new Logger(PostController.name);
  constructor(private readonly postService: PostService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    this.logger.log(`POST /posts - create called`);

    // try {
    return await this.postService.create(createPostDto);
    // } catch (error) {
    //   this.logger.error(
    //     `[PostController.create] Failed to create post`,
    //     error.message,
    //     error.stack,
    //   );
    //   throw new InternalServerErrorException(error.message); // 🆕 Return to frontend
    // }
  }

  @Get()
  async getAllPosts() {
    this.logger.log(`GET /posts - getAllPosts called`);

    // try {
    return await this.postService.getAll();
    // } catch (error) {
    //   this.logger.error(
    //     `[PostController.getAllPosts] Failed to fetch posts`,
    //     error.stack,
    //   );
    //   throw new InternalServerErrorException(error.message);
    // }
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
