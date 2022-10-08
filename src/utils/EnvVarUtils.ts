import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

/**
 * Interface for retrieving the value of environment variables in a type-safe and fail-fast way.
 */
export class EnvVarUtils {
  /**
   * Gets the name of the Google Storage bucket where articles are stored.
   */
  static getBucketName(): string {
    const bucketName: string | undefined = process.env.GOOGLE_STORAGE_BUCKET;
    if (bucketName === undefined) {
      const bucketNameNotFoundError: Error = new Error('Bucket name [GOOGLE_STORAGE_BUCKET] not found in env');
      bucketNameNotFoundError.name = 'Undefined Google Storage Bucket name.';
      throw bucketNameNotFoundError;
    }
    return bucketName;
  }
}