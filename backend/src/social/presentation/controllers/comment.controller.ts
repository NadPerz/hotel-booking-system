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
    this.logger.log(`POST /comments - Add comment request received`, {
      userId: dto.user,
      postId: dto.post,
    });

    try {
      const result = await this.commentService.addComment(dto);
      this.logger.log(`POST /comments - Add comment successful`, {
        userId: dto.user,
        postId: dto.post,
        commentId: result.id,
      });
      return result;
    } catch (error) {
      this.logger.error(`POST /comments - Add comment failed`, {
        userId: dto.user,
        postId: dto.post,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  @Delete(':user/:post/:comment')
  async deleteComment(
    @Param('user') userId: string,
    @Param('post') postId: string,
    @Param('comment') commentId: string,
  ) {
    this.logger.log(`DELETE /comments - Delete comment request received`, {
      userId,
      postId,
      commentId,
    });
    try {
      await this.commentService.deleteComment(commentId, userId, postId);
      this.logger.log(`DELETE /comments - Delete comment successful`, {
        userId,
        postId,
        commentId,
      });
      return { success: true, message: 'Comment deleted successfully' };
    } catch (error) {
      this.logger.error(`DELETE /comments - Delete comment failed`, {
        userId,
        postId,
        commentId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}
