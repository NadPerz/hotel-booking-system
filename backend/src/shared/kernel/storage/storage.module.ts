import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import minioConfig from './infrastructure/config/minio.config';
import { MinioProvider } from './infrastructure/providers/minio.provider';
import { MinioService } from './infrastructure/services/minio.service';
import { StorageApplicationService } from './application/services/storage.service';
import { MediaController } from './presentation/media.controller';

@Module({
  imports: [ConfigModule.forFeature(minioConfig)],
  controllers: [MediaController],
  providers: [MinioProvider, MinioService, StorageApplicationService],
  exports: [StorageApplicationService, MinioService],
})
export class StorageModule {}
