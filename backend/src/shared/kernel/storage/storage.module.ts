import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import minioConfig from './infrastructure/config/minio.config';
import { MinioProvider } from './infrastructure/providers/minio.provider';
import { MinioService } from './infrastructure/services/minio.service';
import { StorageApplicationService } from './application/services/storage.service';

@Module({
  imports: [ConfigModule.forFeature(minioConfig)],
  providers: [MinioProvider, MinioService, StorageApplicationService],
  exports: [StorageApplicationService, MinioService],
})
export class StorageModule {}
