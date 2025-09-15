import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { LikePostDto } from '@shared/types/social/like-post.dto';
import { LikeService } from 'src/social/application/services/like.service';

@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  async likePost(@Body() likePostDto: LikePostDto) {
    console.log(
      `Liked post with id ${likePostDto.post} by user with id ${likePostDto.user}
      Currently in like.controller.ts`,
    );

    return await this.likeService.likePost(likePostDto);
  }

  @Delete(/*':userId/:postId'*/)
  async unlikePost(
    @Body() likePostDto: LikePostDto,
    // @Param('userId') userId: string,
    // @Param('postId') postId: string,
  ) {
    console.log(
      `Unliking post ${likePostDto.post} by user ${likePostDto.user}
      Currently in like.controller.ts`,
    );
    return await this.likeService.unlikePost(likePostDto);
    // return { message: `Post ${postId} unliked by user ${userId}` };
  }
}
