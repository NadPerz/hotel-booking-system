import { Injectable } from '@nestjs/common';
import { MinioService } from '../../infrastructure/services/minio.service';
import { FileUploadDto } from '../interfaces/storage.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageApplicationService {
  constructor(private readonly minioService: MinioService) {}

  // Signed upload URL for direct browser upload
  async getSignedUploadUrl(
    fileName: string,
    moduleBucket?: string,
    expiry?: number,
  ) {
    return await this.minioService.getSignedUploadUrl(
      fileName,
      moduleBucket,
      expiry,
    );
  }

  // Old server-side upload (still valid for small files/admin flows)
  async uploadUserFile(
    file: FileUploadDto,
    userId: string,
    folder?: string,
  ): Promise<string> {
    const fileExtension = this.getFileExtension(file.originalName);
    const fileName = `${folder || 'uploads'}/${userId}/${uuidv4()}${fileExtension}`;
    return await this.minioService.uploadFile(file.buffer, fileName);
  }

  async uploadPostMedia(file: FileUploadDto, postId: string): Promise<string> {
    const fileExtension = this.getFileExtension(file.originalName);
    const fileName = `posts/${postId}/${uuidv4()}${fileExtension}`;
    return await this.minioService.uploadFile(file.buffer, fileName);
  }

  async uploadEventImage(
    file: FileUploadDto,
    eventId: string,
  ): Promise<string> {
    const fileExtension = this.getFileExtension(file.originalName);
    const fileName = `events/${eventId}/${uuidv4()}${fileExtension}`;
    return await this.minioService.uploadFile(file.buffer, fileName);
  }

  async getFileUrl(filePath: string): Promise<string> {
    const [bucketName, ...filePathParts] = filePath.split('/');
    const fileName = filePathParts.join('/');
    return await this.minioService.getFileUrl(fileName, bucketName);
  }

  async deleteFile(filePath: string): Promise<void> {
    const [bucketName, ...filePathParts] = filePath.split('/');
    const fileName = filePathParts.join('/');
    return await this.minioService.deleteFile(fileName, bucketName);
  }

  private getFileExtension(filename: string): string {
    return filename.includes('.')
      ? filename.substring(filename.lastIndexOf('.'))
      : '';
  }
}
