import { Injectable } from '@nestjs/common';
import { LikeRepository } from 'src/social/domain/repositories/like.repository';

@Injectable()
export class LikeRepositoryImpl extends LikeRepository {}
