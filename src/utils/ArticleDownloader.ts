import { HTMLElement, parse } from 'node-html-parser';
import { Datastore } from '@google-cloud/datastore';
import { Storage } from '@google-cloud/storage';

import ArticleFetcher from "./ArticleFetcher";
import { save, storeObjects } from "./GoogleStorageUtils";
import ArticleFrequencyMap, { HeadingBodyFrequencyMap } from "./ArticleFrequencyMap";
import { ArticleWordCount, getStorageIDFromWordCount } from '../types/ArticleWordCount';
import { DatastoreKinds } from '../types/Datastore';

export interface IArticleDownloader {
  downloadRandomArticle: (url?: string) => Promise<Response>;
}

/**
 * An interface for downloading and processing random Wikipedia articles.
 */
export default class ArticleDownloader implements IArticleDownloader {
  constructor() {
    this.articleFetcher = new ArticleFetcher();
    this.datastore = new Datastore();
    this.storage = new Storage();
  }

  private articleFetcher: ArticleFetcher;
  private datastore: Datastore;
  private storage: Storage;
  private bucketName: string = 'wikipedia_searcher_wikipedia_articles';
  private wordSearchWindow: number = 5;
  
  async downloadRandomArticle(url?: string): Promise<Response> {
    const { datastore, storage, bucketName } = this;

    // Fetch a random (or provided Wikipedia article).
    const article: Response = await this.articleFetcher.fetchRandomArticle(url);

    // Download it to the expected Google Storage bucket.
    const articleStr: string = await article.text();
    const articleUrl: string = article.url;
    await save(storage, bucketName, articleUrl, articleStr);

    // Create a frequency map from the content of the article.
    const articleHTML: HTMLElement = parse(articleStr);
    const articleFreqMap: ArticleFrequencyMap = new ArticleFrequencyMap(articleHTML, this.wordSearchWindow);
    const headingBodyFreqMap: HeadingBodyFrequencyMap = articleFreqMap.map();
    const headingWordCounts: ArticleWordCount[] = this.getWordCountsFromFreqMap(headingBodyFreqMap.headings, articleUrl);
    const bodyWordCounts: ArticleWordCount[] = this.getWordCountsFromFreqMap(headingBodyFreqMap.body, articleUrl);

    // Store the word counts in Datastore
    await storeObjects(datastore, DatastoreKinds.HeadingWordCount, getStorageIDFromWordCount, headingWordCounts);
    await storeObjects(datastore, DatastoreKinds.BodyWordCount, getStorageIDFromWordCount, bodyWordCounts);

    return article;
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