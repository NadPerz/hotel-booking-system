// backend/src/shared/services/storage.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class StorageService {
  private minioClient: Minio.Client;

  constructor(private configService: ConfigService) {
    const endpoint = this.configService.get<string>('MINIO_ENDPOINT');
    if (!endpoint) {
      throw new Error('MINIO_ENDPOINT is not configured');
    }

    this.minioClient = new Minio.Client({
      endPoint: endpoint,
      port: 443, // HTTPS port for your MinIO setup
      useSSL: true,
      accessKey: this.configService.get<string>('MINIO_ACCESS_KEY')!,
      secretKey: this.configService.get<string>('MINIO_SECRET_KEY')!,
    });
  }

  async uploadFile(
    bucketName: string,
    objectName: string,
    buffer: Buffer,
    contentType: string,
  ): Promise<string> {
    try {
      // Check if bucket exists, create if not
      const bucketExists = await this.minioClient.bucketExists(bucketName);
      if (!bucketExists) {
        await this.minioClient.makeBucket(bucketName, 'us-east-1');
        console.log(`✅ Bucket ${bucketName} created successfully`);
      }

      // Upload file
      const result = await this.minioClient.putObject(
        bucketName,
        objectName,
        buffer,
        buffer.length,
        { 'Content-Type': contentType }
      );

      console.log('✅ File uploaded successfully:', {
        bucket: bucketName,
        objectName: objectName,
        etag: result.etag
      });

      return objectName;
    } catch (error) {
      console.error('❌ MinIO upload error:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async getSignedUrl(
    bucketName: string,
    objectName: string,
    expiryInSeconds: number = 3600,
  ): Promise<string> {
    try {
      const signedUrl = await this.minioClient.presignedGetObject(
        bucketName,
        objectName,
        expiryInSeconds,
      );
      
      return signedUrl;
    } catch (error) {
      console.error('❌ MinIO signed URL error:', error);
      throw new Error(`Failed to generate signed URL: ${error.message}`);
    }
  }

  async deleteFile(bucketName: string, objectName: string): Promise<void> {
    try {
      await this.minioClient.removeObject(bucketName, objectName);
      console.log('✅ File deleted successfully:', objectName);
    } catch (error) {
      console.error('❌ MinIO delete error:', error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }
}