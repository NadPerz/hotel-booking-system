import { Controller, Post, Body } from '@nestjs/common';
import { StorageApplicationService } from 'src/shared/kernel/storage/application/services/storage.service';

@Controller('social/media')
export class PostMediaController {
  constructor(private readonly storageService: StorageApplicationService) {}

  @Post('signed-upload-url')
  async getSignedUploadUrl(@Body() dto: { fileName: string }) {
    // Use a unique filename strategy, e.g., prefix by user, uuid, timestamp
    const url = await this.storageService.getSignedUploadUrl(
      dto.fileName,
      'social-media', // bucket for social posts/images
    );
    return { url };
  }
}
