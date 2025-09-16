//comment.controller.ts

import { Body, Controller, Delete, Logger, Param, Post } from '@nestjs/common';
import { CreateCommentDto } from '@shared/types/social/create-comment.dto';

import { CommentService } from 'src/social/application/services/comment.service';

@Controller('comments')
export class CommentController {
  private readonly logger = new Logger(CommentController.name);

  constructor(private readonly commentService: CommentService) {}
}
