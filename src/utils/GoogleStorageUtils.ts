import dotenv from 'dotenv';
import path from 'path';

import { Bucket, Storage } from '@google-cloud/storage';

dotenv.config({ path: path.join(__dirname, '../../.env') });

/**
 * Checks to see whether a bucket exists for the project or not.
 */
export async function doesBucketExist(storage: Storage, bucketToCheck: string): Promise<boolean> {
  const [buckets] = await storage.getBuckets();
  return buckets.reduce(
    (doesExist: boolean, bucket: Bucket) => doesExist || bucket.name === bucketToCheck,
    false,
  );
}

export type BucketConfig = {
  storageClass: 'archive' | 'coldline' | 'durable_reduced_availability'
  | 'multi_regional' | 'nearline' | 'regional' | 'standard';
  location: string,
}

/**
 * Creates a storage bucket.
 */
export async function createBucket(
  storage: Storage,
  bucket: string,
  optionalConfig?: BucketConfig,
): Promise<boolean> {
  const { storageClass, location } = {
    storageClass: 'standard',
    location: 'europe-west2',
    ...optionalConfig,
  };
  await storage.createBucket(bucket, {
    location,
    [storageClass]: true,
  });
  return true;
}

/**
 * Stores an entity, handling the creation of a bucket if necessary.
 */
export async function save(
  storage: Storage,
  bucket: string,
  fileName: string,
  data: string | Buffer,
  optionalBucketConfig?: BucketConfig,
): Promise<boolean> {
  // If the bucket doesn't exist, we need to create it.
  const bucketExists: boolean = await doesBucketExist(storage, bucket);
  if (!bucketExists) {
    await createBucket(storage, bucket, optionalBucketConfig);
  }
  await storage.bucket(bucket).file(fileName).save(data);
  return true;
}

/**
 * Downloads an entity to memory.
 */
export async function download(
  storage: Storage,
  bucket: string,
  fileName: string,
): Promise<string> {
  const contents: Buffer[] = await storage.bucket(bucket).file(fileName).download();
  return contents.reduce(
    (returnStr: string, buffer: Buffer) => returnStr.concat(buffer.toString()),
    '',
  );
}

/**
 * Checks the existence of a file.
 */
export async function doesFileExist(
  storage: Storage,
  bucket: string,
  fileName: string,
): Promise<boolean> {
  return (await storage.bucket(bucket).file(fileName).exists())[0];
}
