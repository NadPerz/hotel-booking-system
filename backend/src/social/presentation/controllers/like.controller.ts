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
    this.logger.log(`POST /likes request`, {
      userId: likePostDto.user,
      postId: likePostDto.post,
    });
    return await this.likeService.likePost(likePostDto);
  }

  @Delete(':user/:post')
  async unlikePost(
    @Param('user') userId: string,
    @Param('post') postId: string,
  ) {
    const likePostDto: LikePostDto = { user: userId, post: postId };

    this.logger.log(`DELETE /likes request`, {
      userId: likePostDto.user,
      postId: likePostDto.post,
    });
    await this.likeService.unlikePost(likePostDto);
    return { success: true, message: 'Post unliked successfully' };
  }
}
