// src/social/social.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from './infrastructure/schemas/post.schema';
import { PostController } from './presentation/controllers/post.controller';
import { PostService } from './application/services/post.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }])],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class SocialModule {}
