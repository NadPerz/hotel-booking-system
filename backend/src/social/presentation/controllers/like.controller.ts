import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LikePostDto } from '@shared/types/social/like-post.dto';
import { LikeService } from 'src/social/application/services/like.service';

@Controller('likes')
export class LikeController {}
