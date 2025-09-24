/**
 * Interface for object storage services, defining core file manipulation operations.
 */
export interface StorageService {
  /**
   * Uploads a file buffer to the specified bucket under a given file name.
   * This is done when files are to be uploaded from backend server
   * @param file The file data as a Buffer
   * @param fileName The desired name for the file in storage
   * @param bucketName (Optional) The destination bucket; uses default if omitted
   * @returns A Promise resolving to the public URL or identifier of the uploaded file
   */
  uploadFile(
    file: Buffer,
    fileName: string,
    bucketName?: string,
  ): Promise<string>;

  /**
   * Downloads a file as a Buffer from a given bucket.
   * @param fileName The name of the file to download
   * @param bucketName (Optional) The bucket from which to retrieve the file
   * @returns A Promise resolving with the file contents as a Buffer
   */
  downloadFile(fileName: string, bucketName?: string): Promise<Buffer>;

  /**
   * Deletes the specified file from the given bucket.
   * @param fileName The name of the file to delete
   * @param bucketName (Optional) The bucket from which to delete the file
   * @returns A Promise that completes when the file is deleted
   */
  deleteFile(fileName: string, bucketName?: string): Promise<void>;

  /**
   * Retrieves the public URL for a stored file.
   * @param fileName The name of the file
   * @param bucketName (Optional) The bucket in which the file is stored
   * @returns A Promise that resolves to the file's URL
   */
  getFileUrl(fileName: string, bucketName?: string): Promise<string>;

  /**
   * Generates a signed URL that allows clients to upload a file directly to the specified bucket
   * without requiring credentials. Useful for secure, time-limited uploads from browsers or external services.
   * @param fileName The name for the file to be uploaded
   * @param bucketName (Optional) The target bucket for the upload; uses default if omitted
   * @param expiry (Optional) The expiration time for the signed URL in seconds; defaults to provider's standard if not provided
   * @returns A Promise resolving to the signed upload URL as a string
   */
  getSignedUploadUrl(
    fileName: string,
    bucketName?: string,
    expiry?: number,
  ): Promise<string>;

  /**
   * Creates a new bucket in the storage provider.
   * @param bucketName The name for the new bucket
   * @returns A Promise that completes when the bucket is created
   */
  createBucket(bucketName: string): Promise<void>;

  /**
   * Checks if a bucket exists in the storage provider.
   * @param bucketName The name of the bucket to check
   * @returns A Promise resolving to true if the bucket exists, false otherwise
   */
  bucketExists(bucketName: string): Promise<boolean>;
}

/**
 * Data Transfer Object for file uploads, standardizing file metadata.
 */
export interface FileUploadDto {
  /** The file content as a Buffer */
  buffer: Buffer;
  /** The original name of the uploaded file */
  originalName: string;
  /** The MIME type of the uploaded file */
  mimetype: string;
  /** The size of the uploaded file in bytes */
  size: number;
}
