import { DeleteObjectCommand, HeadBucketCommand, PutObjectCommand, S3Client, CreateBucketCommand } from '@aws-sdk/client-s3';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, randomUUID } from 'crypto';

export type StoredPdf = {
  bucket: string;
  objectKey: string;
  checksumSha256: string;
  sizeBytes: bigint;
};

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(@Inject(ConfigService) private readonly config: ConfigService) {
    this.bucket = this.config.get<string>('S3_BUCKET') ?? 'library-pdfs';
    this.client = new S3Client({
      region: this.config.get<string>('S3_REGION') ?? 'us-east-1',
      endpoint: this.config.get<string>('S3_ENDPOINT'),
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.config.get<string>('S3_ACCESS_KEY_ID') ?? 'minioadmin',
        secretAccessKey: this.config.get<string>('S3_SECRET_ACCESS_KEY') ?? 'minioadmin'
      }
    });
  }

  async ensureBucket(): Promise<void> {
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
    } catch {
      await this.client.send(new CreateBucketCommand({ Bucket: this.bucket }));
    }
  }

  async putPrivatePdf(file: Express.Multer.File): Promise<StoredPdf> {
    await this.ensureBucket();
    const checksumSha256 = createHash('sha256').update(file.buffer).digest('hex');
    const objectKey = `raw-books/${randomUUID()}/${checksumSha256}.pdf`;
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: objectKey,
        Body: file.buffer,
        ContentType: 'application/pdf',
        Metadata: { originalFilename: file.originalname, checksumSha256 }
      })
    );
    return { bucket: this.bucket, objectKey, checksumSha256, sizeBytes: BigInt(file.size) };
  }

  async deleteObject(bucket: string, objectKey: string): Promise<void> {
    try {
      await this.client.send(new DeleteObjectCommand({ Bucket: bucket, Key: objectKey }));
    } catch (error) {
      this.logger.warn(`Failed to cleanup object ${bucket}/${objectKey}: ${(error as Error).message}`);
    }
  }
}
