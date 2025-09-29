//post.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreatePostDto } from '@shared/types/social/create-post.dto';
import { UpdatePostDto } from 'src/social/application/dtos/update-post.dto';
import { PostService } from 'src/social/application/services/post.service';

@Controller('social/posts')
export class PostController {
  private readonly logger = new Logger(PostController.name);
  constructor(private readonly postService: PostService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    this.logger.log(`POST /posts request`, {
      userId: createPostDto.user,
      contentLength: createPostDto.content?.length || 0,
    });
    return await this.postService.create(createPostDto);
  }

  @Get()
  async getAllPosts(@Query('userId') userId?: string) {
    this.logger.log(`GET /posts request`, { userId: userId || 'anonymous' });

    // Use new service method that returns PostWithLikeStatus entities
    return await this.postService.getAllWithLikeStatus(userId);
  }

  //Getting posts by user ID NOT IMPLEMENTED
  @Get('user/:userId')
  async getPostsByUserId(@Param('userId') userId: string) {
    this.logger.warn(`GET /posts/user/:userId not implemented`, { userId });
    // return await this.postService.getByUserId(userId);
  }

  //Getting posts by post ID NOT IMPLEMENTED
  @Get(':id')
  async getPostById(@Param('id') id: string) {
    this.logger.warn(`GET /posts/:id not implemented`, { postId: id });
    // return await this.postService.getById(id);
  }

  @Delete(':postId')
  async delete(
    @Param('postId') postId: string,
    @Body() body: { user?: string },
  ) {
    const userId = body?.user as string;
    this.logger.log(`DELETE /posts/:postId request`, {
      userId,
      postId,
    });
    await this.postService.delete(postId, userId);
    return { success: true, message: 'Post deleted successfully' };
  }

  @Patch(':postId')
  async update(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto & { user: string },
  ) {
    const userId = updatePostDto.user;

    this.logger.log(`PATCH /posts/:postId request`, {
      userId,
      postId,
      hasContent: !!updatePostDto.content,
      mediaToAdd: updatePostDto.mediaFilesToAdd?.length || 0,
      mediaToRemove: updatePostDto.mediaFilesToRemove?.length || 0,
    });

    return await this.postService.update(postId, updatePostDto, userId);
  }
}
