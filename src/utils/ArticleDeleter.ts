import { Datastore, Query } from '@google-cloud/datastore';
import { File, Storage } from '@google-cloud/storage';
import { ArticleWordCount } from '../types/ArticleWordCount';
import { DatastoreKinds } from '../types/Datastore';
import { EnvVarUtils } from './EnvVarUtils';
import { deleteAllObjects, getListOfFilesInBucket } from './GoogleStorageUtils';

export interface IArticleDeleter {
  deleteAllArticleWCs: () => Promise<boolean>;
}

/**
 * An interface for processing stored Wikipedia articles.
 */
export default class ArticleDeleter implements IArticleDeleter {
  constructor() {
    this.datastore = new Datastore();
    this.storage = new Storage();
  }

  private datastore: Datastore;
  private storage: Storage;
  private bucket: string = EnvVarUtils.getBucketName();

  async deleteAllArticleWCs(): Promise<boolean> {
    const { datastore } = this;

    // Delete all existing word counts.
    await deleteAllObjects(datastore, DatastoreKinds.HeadingWordCount);
    await deleteAllObjects(datastore, DatastoreKinds.BodyWordCount);

    return true;
  
  }
}