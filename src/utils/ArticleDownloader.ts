import { parse } from 'node-html-parser';
import { Storage } from '@google-cloud/storage';

import ArticleFetcher from "./ArticleFetcher";
import { save } from "./GoogleStorageUtils";
import { EnvVarUtils } from './EnvVarUtils';
import ArticleProcessor from './ArticleProcessor';

export interface IArticleDownloader {
  downloadAndProcessRandomArticle: (url?: string) => Promise<Response>;
}

/**
 * An interface for downloading and processing random Wikipedia articles.
 */
export default class ArticleDownloader implements IArticleDownloader {
  constructor() {
    this.articleFetcher = new ArticleFetcher();
    this.storage = new Storage();
  }

  private articleFetcher: ArticleFetcher;
  private storage: Storage;
  private bucketName: string = EnvVarUtils.getBucketName();
  private wordSearchWindow: number = 5;
  
  async downloadAndProcessRandomArticle(url?: string): Promise<Response> {
    const { storage, bucketName } = this;

    // Fetch a random (or provided Wikipedia article).
    const article: Response = await this.articleFetcher.fetchRandomArticle(url);

    // Download it to the expected Google Storage bucket.
    const articleStr: string = await article.text();
    const articleUrl: string = article.url;
    await save(storage, bucketName, articleUrl, articleStr);

    // Process the article (create and store word counts)
    const articleProcessor: ArticleProcessor = new ArticleProcessor();
    await articleProcessor.processArticle(articleUrl, parse(articleStr), this.wordSearchWindow);

    return article;
  }
}