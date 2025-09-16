//like.service.ts

import { Injectable } from '@nestjs/common';
import { LikePostDto } from '@shared/types/social/like-post.dto';
import { Like } from 'src/social/domain/entities/like.entity';
import { LikeRepository } from 'src/social/domain/repositories/like.repository';
// 🆕 NEW: Import PostRepository
import { PostRepository } from 'src/social/domain/repositories/post.repository';

@Injectable()
export class LikeService {
  constructor(
    private readonly likeRepository: LikeRepository,
    // 🆕 NEW: Inject PostRepository
    private readonly postRepository: PostRepository,
  ) {}

  /**
   * Like post by the current user
   */
  async likePost(likePostDto: LikePostDto): Promise<Like> {
    console.log(`Attempting to like post ${likePostDto.post} by user ${likePostDto.user}
                     Currently in like.service.ts`);

    const like = new Like('null', likePostDto.user, likePostDto.post);

    try {
      // 🔄 CHANGED: Use new transaction method and coordinate both operations
      const result = await this.likeRepository.likePostWithTransaction(
        like,
        async (session) => {
          // This callback gets executed within the transaction
          const savedLike = await this.likeRepository.likePost(like, session);
          await this.postRepository.addLike(
            likePostDto.post,
            savedLike.id,
            session,
          );
          return savedLike;
        },
      );

      console.log(
        `Successfully liked post ${likePostDto.post} by user ${likePostDto.user}`,
      );
      return result;
    } catch (error) {
      console.error(
        `Error liking post ${likePostDto.post} by user ${likePostDto.user}:`,
        error,
      );

      // Handle the duplicate key error specifically
      if (error.code === 11000) {
        throw new Error(
          `User ${likePostDto.user} has already liked post ${likePostDto.post}`,
        );
      }

      throw error;
    }
  }

  /**
   * Unlike a post for a given user.
   */
  async unlikePost(likePostDto: LikePostDto): Promise<void> {
    console.log(`Attempting to un-like post ${likePostDto.post} by user ${likePostDto.user}
                     Currently in like.service.ts`);

    const like = new Like('null', likePostDto.user, likePostDto.post);

    try {
      // 🔄 CHANGED: Use new transaction method and coordinate both operations
      await this.likeRepository.unlikePostWithTransaction(
        like,
        async (session) => {
          const existingLike = await this.likeRepository.findByUserAndPost(
            likePostDto.user,
            likePostDto.post,
            session,
          );

          if (existingLike) {
            await this.likeRepository.unlikePost(like, session);
            await this.postRepository.removeLike(
              likePostDto.post,
              existingLike.id,
              session,
            );
          }
        },
      );

      console.log(
        `Successfully un-liked post ${likePostDto.post} by user ${likePostDto.user}`,
      );
    } catch (error) {
      console.error(
        `Error un-liking post ${likePostDto.post} by user ${likePostDto.user}:`,
        error,
      );
      throw error;
    }
  }
}

// import { Injectable } from '@nestjs/common';
// import { LikePostDto } from '@shared/types/social/like-post.dto';
// import { Like } from 'src/social/domain/entities/like.entity';
// import { LikeRepository } from 'src/social/domain/repositories/like.repository';

// @Injectable()
// export class LikeService {
//   constructor(private readonly likeRepository: LikeRepository) {}

//   /**
//    * Like post by the current user
//    *
//    *@param likePostDto - The like dto object
//    *
//    * @returns Promise<Like> the promise of a create Like object
//    */
//   async likePost(likePostDto: LikePostDto): Promise<Like> {
//     console.log(`Attempting to like post ${likePostDto.post} by user ${likePostDto.user}
//                      Currently in like.service.ts`);

//     // console.log(`DEBUG: LikePostDto received:`, likePostDto);
//     // console.log(`DEBUG: likePostDto.user: ${likePostDto.user}`);
//     // console.log(`DEBUG: likePostDto.post: ${likePostDto.post}`);

//     const like = new Like('null', likePostDto.user, likePostDto.post);

//     // console.log(`DEBUG: Like entity created:`, like);
//     // console.log(`DEBUG: like.user: ${like.user}`);
//     // console.log(`DEBUG: like.post: ${like.post}`);

//     try {
//       const result = await this.likeRepository.likePost(like);
//       console.log(
//         `Successfully liked post ${likePostDto.post} by user ${likePostDto.user}`,
//       );
//       return result;
//     } catch (error) {
//       console.error(
//         `Error liking post ${likePostDto.post} by user ${likePostDto.user}:`,
//         error,
//       );

//       // Handle the duplicate key error specifically
//       if (error.code === 11000) {
//         throw new Error(
//           `User ${likePostDto.user} has already liked post ${likePostDto.post}`,
//         );
//       }

//       throw error;
//     }
//   }

//   /**
//    * Unlike a post for a given user.
//    *
//    * @param likePostDto - The like dto object
//    *
//    * @returns Promise<void>
//    */
//   async unlikePost(likePostDto: LikePostDto): Promise<void> {
//     console.log(`Attempting to un-like post ${likePostDto.post} by user ${likePostDto.user}
//                      Currently in like.service.ts`);
//     const like = new Like('null', likePostDto.user, likePostDto.post);

//     try {
//       await this.likeRepository.unlikePost(like);
//       console.log(
//         `Successfully un-liked post ${likePostDto.post} by user ${likePostDto.user}`,
//       );
//     } catch (error) {
//       console.error(
//         `Error un-liking post ${likePostDto.post} by user ${likePostDto.user}:`,
//         error,
//       );
//       throw error;
//     }
//   }
// }
