//post-media.controller.ts

import { Controller, Post, Body, Logger } from '@nestjs/common';
import { StorageApplicationService } from 'src/shared/kernel/storage/application/services/storage.service';

@Controller('social/media')
export class PostMediaController {
  private readonly logger = new Logger(PostMediaController.name);

  constructor(private readonly storageService: StorageApplicationService) {}

  @Post('signed-upload-url')
  async getSignedUploadUrl(@Body() dto: { fileName: string }) {
    this.logger.log(`POST /social/media/signed-upload-url request`, {
      fileName: dto.fileName,
      // Optionally add more metadata (user ID, timestamp, etc.)
    });

    // Use a unique filename strategy, e.g., prefix by user, uuid, timestamp
    const url = await this.storageService.getSignedUploadUrl(
      dto.fileName,
      'social-media', // bucket for social posts/images
    );
    this.logger.log(`Signed upload URL generated`, {
      fileName: dto.fileName,
      url,
    });
    return { url };
  }
}
