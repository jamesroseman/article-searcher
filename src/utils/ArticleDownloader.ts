import ArticleFetcher from "./ArticleFetcher";
import { save } from "./GoogleStorageUtils";
import { Storage } from '@google-cloud/storage';

export interface IArticleDownloader {
  downloadRandomArticle: (url?: string) => Promise<Response>;
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
  private bucketName: string = 'wikipedia_searcher_wikipedia_articles';
  
  async downloadRandomArticle(url?: string): Promise<Response> {
    const { storage, bucketName } = this;

    // Fetch a random (or provided Wikipedia article).
    const article: Response = await this.articleFetcher.fetchRandomArticle(url);

    // Download it to the expected Google Storage bucket.
    const articleStr: string = await article.text();
    const articleUrl: string = article.url;
    await save(storage, bucketName, articleUrl, articleStr);

    return article;
  }
}