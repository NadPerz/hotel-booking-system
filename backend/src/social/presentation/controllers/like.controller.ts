//like.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { LikePostDto } from '@shared/types/social/like-post.dto';
import { LikeService } from 'src/social/application/services/like.service';

@Controller('likes')
export class LikeController {
  private readonly logger = new Logger(LikeController.name);

  constructor(private readonly likeService: LikeService) {}

  @Post()
  async likePost(@Body() likePostDto: LikePostDto) {
    this.logger.log(`POST /likes - Like post request received`, {
      userId: likePostDto.user,
      postId: likePostDto.post,
    });

    try {
      const result = await this.likeService.likePost(likePostDto);

      this.logger.log(`POST /likes - Like post successful`, {
        userId: likePostDto.user,
        postId: likePostDto.post,
        likeId: result.id,
      });

      return result;
    } catch (error) {
      this.logger.error(`POST /likes - Like post failed`, {
        userId: likePostDto.user,
        postId: likePostDto.post,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  @Delete(':user/:post')
  async unlikePost(
    @Param('user') userId: string,
    @Param('post') postId: string,
  ) {
    const likePostDto: LikePostDto = { user: userId, post: postId };

    this.logger.log(`DELETE /likes - Unlike post request received`, {
      userId: likePostDto.user,
      postId: likePostDto.post,
    });
    try {
      await this.likeService.unlikePost(likePostDto);

      // success logging
      this.logger.log(`DELETE /likes - Unlike post successful`, {
        userId: likePostDto.user,
        postId: likePostDto.post,
      });

      return { success: true, message: 'Post unliked successfully' };
    } catch (error) {
      // error logging
      this.logger.error(`DELETE /likes - Unlike post failed`, {
        userId: likePostDto.user,
        postId: likePostDto.post,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}
