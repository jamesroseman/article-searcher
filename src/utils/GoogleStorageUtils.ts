import dotenv from 'dotenv';
import path from 'path';
import { Datastore, Query } from '@google-cloud/datastore';
import { Bucket, Storage, File } from '@google-cloud/storage';

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

/**
 * Gets a list of all files in a bucket.
 */
export async function getListOfFilesInBucket(
  storage: Storage,
  bucket: string,
): Promise<File[]> {
  const [files] = await storage.bucket(bucket).getFiles();
  return files;
}

/**
 * Stores an object in Datastore.
 */
export async function storeObjects(
  datastore: Datastore,
  kind: string,
  getIDFromObject: (obj: any) => string,
  objects: any[],
): Promise<boolean> {
  try {
    const objs = objects.map((object: any) => {
      const id: string = getIDFromObject(object);
      const key = datastore.key([kind, id]);
      return { key, data: object };
    });
    // Datastore upsert calls need to be in batches of 400.
    const batchedObjs: any[][] = [];
    while (objs.length > 0) {
      const currentObjs = objs.splice(0, 400);
      batchedObjs.push(currentObjs);
    }
    await Promise.all(batchedObjs.map(async (objs: any[]) => {
      await datastore.upsert(objs);
    }));
    return true;
  } catch {
    return false;
  }
}

/**
 * Deletes all objects of a Kind in Datastore.
 */
export async function deleteAllObjects(
  datastore: Datastore,
  kind: string,
): Promise<boolean> {
  try {
    const query: Query = datastore.createQuery(kind);
    const objects: ({ [datastore.KEY]: any })[] = await fetchObjects<({ [datastore.KEY]: any })>(datastore, query);
    const keys = objects.map((obj) => obj[datastore.KEY]);
    // Datastore delete calls need to be in batches of 400.
    const batchedKeys: any[][] = [];
    while (keys.length > 0) {
      const currentKeys = keys.splice(0, 400);
      batchedKeys.push(currentKeys);
    }
    await Promise.all(batchedKeys.map(async (keys: any[]) => {
      await datastore.delete(keys);
    }));
    return true;
  } catch {
    return false;
  }
}

/**
 * Retrieves objects from Datastore.
 */
export async function fetchObjects<T>(
  datastore: Datastore,
  query: Query,
): Promise<T[]> {
  const [objects] = await datastore.runQuery(query);
  return objects as T[];
}