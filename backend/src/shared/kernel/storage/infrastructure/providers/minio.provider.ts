import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

export const MINIO_CLIENT = 'MINIO_CLIENT';

export const MinioProvider: Provider = {
  provide: MINIO_CLIENT,
  useFactory: (configService: ConfigService) => {
    return new Minio.Client({
      endPoint: configService.get<string>('minio.endPoint') || 'localhost',
      port: Number(configService.get<string>('minio.port') || 9000),
      useSSL: configService.get<string>('minio.useSSL') === 'true',
      accessKey: configService.get<string>('minio.accessKey') || 'minioadmin',
      secretKey: configService.get<string>('minio.secretKey') || 'minioadmin',
      region: configService.get<string>('minio.region') || 'us-east-1',
    });
  },
  inject: [ConfigService],
};
