import { Injectable } from '@nestjs/common';
import { CommentRepository } from 'src/social/domain/repositories/comment.repository';

@Injectable()
export class CommentRepositoryImpl extends CommentRepository {}
