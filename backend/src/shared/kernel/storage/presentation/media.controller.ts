import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { StorageApplicationService } from '../application/services/storage.service';

@Controller('media')
export class MediaController {
  private readonly logger = new Logger(MediaController.name);
  constructor(private readonly storageAppService: StorageApplicationService) {}

  /**
   * Get a signed GET URL for any file by its full filePath (format: bucket/file/name.ext).
   * Example: GET /media/signed-get-url?filePath=social-media/somefile.png&expiry=900
   */
  @Get('signed-get-url')
  async getSignedGetUrl(
    @Query('filePath') filePath: string,
    // @Query('expiry') expiry?: string, // (seconds, optional)
  ) {
    this.logger.log(
      `Received GET request for signed-get-url with filePath="${filePath}"`,
    );

    if (!filePath) {
      throw new BadRequestException(
        'filePath is required (format: bucket/file.png)',
      );
    }
    const url = await this.storageAppService.getFileUrl(
      filePath,
      //   expiry ? parseInt(expiry, 10) : undefined,
    );
    this.logger.log(`Generated signed GET URL for filePath="${filePath}"`);

    return { url };
  }

  /**
   * Get a signed PUT URL to allow upload to a given bucket and filename.
   * Example: POST /media/signed-upload-url  { fileName: 'abc.png', bucket: 'social-media', expiry: 1800 }
   */
  @Post('signed-upload-url')
  async getSignedPutUrl(
    @Body() body: { fileName: string; bucket?: string; expiry?: number },
  ) {
    this.logger.log(
      `Received POST request for signed-upload-url with body=${JSON.stringify(body)}`,
    );

    if (!body.fileName) {
      this.logger.warn('fileName is missing in request body');
      throw new BadRequestException('fileName is required');
    }

    const url = await this.storageAppService.getSignedUploadUrl(
      body.fileName,
      body.bucket,
      body.expiry,
    );
    this.logger.log(
      `Generated signed PUT URL for fileName="${body.fileName}" in bucket="${body.bucket || 'default'}"`,
    );
    return { url };
  }
}
