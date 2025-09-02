// src/social/social.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from './infrastructure/schemas/post.schema';
import { PostController } from './presentation/controllers/post.controller';
import { PostService } from './application/services/post.service';
import { PostRepository } from './domain/repositories/post.repository';
import { PostRepositoryImpl } from './infrastructure/repositories/post.repository.impl';
import { TravelerSchema } from './infrastructure/schemas/traveler.schema';
import { PostCommentSchema } from './infrastructure/schemas/comment.schema';
import { LikeSchema } from './infrastructure/schemas/like.schema';
import { HasFriendshipSchema } from './infrastructure/schemas/friendships.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Post', schema: PostSchema },
      { name: 'Traveler', schema: TravelerSchema },
      { name: 'PostComment', schema: PostCommentSchema },
      { name: 'Like', schema: LikeSchema },
      { name: 'HasFriendship', schema: HasFriendshipSchema },
    ]),
  ],
  controllers: [PostController],
  providers: [
    PostService,
    { provide: PostRepository, useClass: PostRepositoryImpl },
  ],
  exports: [PostService],
})
export class SocialModule {}
