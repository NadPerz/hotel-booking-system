//post.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { CreatePostDto } from '@shared/types/social/create-post.dto';
import { Post } from 'src/social/domain/entities/post.entity';
import { PostRepository } from 'src/social/domain/repositories/post.repository';

/**
 * Service class for managing post operations.
 * Provides business logic for creating and retrieving posts.
 */
@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(private readonly postRepository: PostRepository) {}

  /**
   * Creates a new post with the provided content and user information.
   *
   * @param createPostDto - Data transfer object containing post creation data
   * @returns Promise resolving to the created post entity
   * @throws Error if the creation operation fails
   */
  async create(createPostDto: CreatePostDto): Promise<Post> {
    this.logger.log(
      `[PostService.create] Creating post for user ${createPostDto.user}`,
    );

    const post = new Post(
      'null', // post Id will be given by db
      createPostDto.user,
      createPostDto?.content ?? '',
    );

    // content: dto?.content || "",   // fallback to blank string
    // author: dto?.author || "Anonymous"

    return await this.postRepository.create(post);
  }

  /**
   * Retrieves all posts from the system.
   *
   * @returns Promise resolving to an array of all post entities
   * @throws Error if the retrieval operation fails
   */
  async getAll(): Promise<Post[]> {
    this.logger.log(`[PostService.getAll] Fetching all posts`);
    return await this.postRepository.getAll();
  }
}
