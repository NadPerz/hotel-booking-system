//comment.controller.ts

import { Body, Controller, Delete, Logger, Param, Post } from '@nestjs/common';
import { CreateCommentDto } from '@shared/types/social/create-comment.dto';

import { CommentService } from 'src/social/application/services/comment.service';

@Controller('comments')
export class CommentController {
  private readonly logger = new Logger(CommentController.name);

  constructor(private readonly commentService: CommentService) {}

  @Post()
  async addComment(@Body() dto: CreateCommentDto) {
    this.logger.log(`POST /comments request`, {
      userId: dto.user,
      postId: dto.post,
    });
    return await this.commentService.addComment(dto);
  }

  @Delete(':user/:post/:comment')
  async deleteComment(
    @Param('user') userId: string,
    @Param('post') postId: string,
    @Param('comment') commentId: string,
  ) {
    this.logger.log(`DELETE /comments request`, {
      userId,
      postId,
      commentId,
    });
    await this.commentService.deleteComment(commentId, userId, postId);
    return { success: true, message: 'Comment deleted successfully' };
  }
}
