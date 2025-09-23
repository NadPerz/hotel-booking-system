import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

export const MINIO_CLIENT = 'MINIO_CLIENT';

export const MinioProvider: Provider = {
  provide: MINIO_CLIENT,
  useFactory: (configService: ConfigService) => {
    return new Minio.Client({
      endPoint: configService.get<string>('minio.endPoint') || 'localhost',
      port: configService.get('minio.port'),
      useSSL: configService.get('minio.useSSL'),
      accessKey: configService.get('minio.accessKey'),
      secretKey: configService.get('minio.secretKey'),
      region: configService.get('minio.region'),
    });
  },
  inject: [ConfigService],
};
