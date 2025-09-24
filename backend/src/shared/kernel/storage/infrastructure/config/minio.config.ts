import { registerAs } from '@nestjs/config';

export default registerAs('minio', () => ({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  //   port: process.env.MINIO_PORT || 9000,
  //   useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
  bucketName: process.env.MINIO_BUCKET_NAME || 'app-storage',
  //   region: process.env.MINIO_REGION || 'us-east-1',
}));
