import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { nanoid } from 'nanoid';

export interface UploadResult {
  key: string;
  mimeType: string;
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.bucketName = process.env.AWS_BUCKET_NAME || '';
    this.initializeS3();
  }

  private initializeS3() {
    try {
      this.s3Client = new S3Client({
        region: process.env.AWS_REGION || 'us-east-1',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        },
      });

      this.logger.log('S3 Client initialized');
    } catch (error) {
      this.logger.error('Failed to initialize S3 Client', error);
      throw error;
    }
  }

  /**
   * Uploads a file to a specific path in the S3 bucket
   * @param buffer - The buffer of the file to upload
   * @param filePath - The path to upload the file to
   * @param mimeType - The mime type of the file
   * @returns The key and mime type of the uploaded file
   */
  async uploadFileToPath(
    buffer: Buffer,
    filePath: string,
    mimeType: string,
  ): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: filePath,
      Body: buffer,
      ContentType: mimeType,
    });

    await this.s3Client.send(command);
  }

  /**
   * Uploads a file to the S3 bucket (Less flexible compared to uploadFileToPath)
   * @param file - The file to upload
   * @param folder - The folder to upload the file to
   * @returns The key and mime type of the uploaded file
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadResult> {
    this.logger.log('Uploading file to S3', {
      folder,
      mimeType: file.mimetype,
      size: file.size,
    });

    try {
      // Validate file
      this.validateFile(file);

      // Generate unique key using nanoid
      const fileExtension = this.getFileExtension(file.originalname);
      const key = `${nanoid()}${fileExtension}`;
      const filePath = `${folder}/${key}`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: filePath,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3Client.send(command);

      this.logger.log('File uploaded successfully', { key: filePath });

      return {
        key: filePath,
        mimeType: file.mimetype,
      };
    } catch (error) {
      this.logger.error('Error uploading file to S3', error);
      throw error;
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    this.logger.log('Deleting file from S3', { filePath });

    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: filePath,
      });

      await this.s3Client.send(command);

      this.logger.log('File deleted successfully', { filePath });
    } catch (error) {
      this.logger.error('Error deleting file from S3', error);
      throw error;
    }
  }

  /**
   * Generates a pre-signed GET URL for accessing a private S3 object
   * @param key - The S3 object key
   * @param expiresInSeconds - URL expiration time in seconds (default: 300)
   * @returns Pre-signed URL
   */
  async getSignedGetUrl(
    key: string,
    expiresInSeconds: number = 300,
  ): Promise<string> {
    this.logger.log('Generating signed GET URL', { key, expiresInSeconds });

    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: expiresInSeconds,
      });

      this.logger.log('Signed URL generated successfully', { key });
      return signedUrl;
    } catch (error) {
      this.logger.error('Error generating signed URL', error);
      throw error;
    }
  }

  private validateFile(file: Express.Multer.File): void {
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/webp',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`,
      );
    }

    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeInBytes) {
      throw new BadRequestException(
        `File too large. Maximum size: ${maxSizeInBytes / (1024 * 1024)}MB`,
      );
    }
  }

  getFileExtension(filename: string): string {
    const parts = filename.split('.');
    if (parts.length > 1) {
      return `.${parts[parts.length - 1].toLowerCase()}`;
    }
    return '';
  }
}
