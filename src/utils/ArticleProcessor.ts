import { HTMLElement, parse } from 'node-html-parser';
import { Datastore } from '@google-cloud/datastore';
import { File, Storage } from '@google-cloud/storage';

import { getListOfFilesInBucket, save, storeObjects } from "./GoogleStorageUtils";
import ArticleFrequencyMap, { HeadingBodyFrequencyMap } from "./ArticleFrequencyMap";
import { ArticleWordCount, getStorageIDFromWordCount } from '../types/ArticleWordCount';
import { DatastoreKinds } from '../types/Datastore';
import { EnvVarUtils } from './EnvVarUtils';

export interface IArticleProcessor {
  processArticle: (url: string, article: HTMLElement, wordSearchWindow?: number) => Promise<boolean>;
  processAllArticles: (wordSearchWindow?: number) => Promise<boolean>;
}

/**
 * An interface for processing stored Wikipedia articles.
 */
export default class ArticleProcessor implements IArticleProcessor {
  constructor() {
    this.datastore = new Datastore();
    this.storage = new Storage();
  }

  private datastore: Datastore;
  private storage: Storage;
  private bucket: string = EnvVarUtils.getBucketName();

  async processAllArticles(wordSearchWindow?: number): Promise<boolean> {
    const { storage, bucket }  = this;

    try {
      const articles: File[] = await getListOfFilesInBucket(storage, bucket);
      await Promise.all(
        articles.map(async (article: File) => {
          const url: string = article.name;
          const response = await article.download();
          const contents = response[0].toString();
          const articleHTML: HTMLElement = parse(contents);
          await this.processArticle(url, articleHTML, wordSearchWindow);
        })
      );
      return true;
    } catch {
      return false;
    }
  };

  /**
   * Processes one article and stores the resulting word counts in Datastore.
   */
  async processArticle(url: string, article: HTMLElement, wordSearchWindow: number = 5): Promise<boolean> {
    const { datastore } = this;

    try {
      // Create a frequency map from teh content of the article.
      const articleFreqMap: ArticleFrequencyMap = new ArticleFrequencyMap(article, wordSearchWindow);
      const headingBodyFreqMap: HeadingBodyFrequencyMap = articleFreqMap.map();
      const headingWordCounts: ArticleWordCount[] = this.getWordCountsFromFreqMap(headingBodyFreqMap.headings, url);
      const bodyWordCounts: ArticleWordCount[] = this.getWordCountsFromFreqMap(headingBodyFreqMap.body, url);
      
      // Store the word counts in Datastore
      await storeObjects(datastore, DatastoreKinds.HeadingWordCount, getStorageIDFromWordCount, headingWordCounts);
      await storeObjects(datastore, DatastoreKinds.BodyWordCount, getStorageIDFromWordCount, bodyWordCounts);

      return true;
    } catch {
      return false;
    }
  }

  private getWordCountsFromFreqMap(map: { [word: string]: number }, url: string): ArticleWordCount[] {
    return Object.keys(map)
      .map((key: string) => ({
        word: key,
        freq: map[key],
        url,
      } as ArticleWordCount));
  }
}