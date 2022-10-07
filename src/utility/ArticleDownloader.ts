export const INVALID_URL_PROVIDED_ERROR: string = 'ArticleDownloader - Invalid URL provided. Only Wikipedia URLs are allowed.';

export interface IArticleDownloader {
  downloadRandomArticle: (url?: string) => Promise<any>;
}

/**
 * An interface for downloading the raw HTML of random Wikipedia articles.
 */
export default class ArticleDownloader implements IArticleDownloader {
  // This resolves to a random Wikipedia article.
  private defaultQueryUrl: string = 'https://en.wikipedia.org/wiki/Special:Random';
  
  /**
   * Fetches a random article from Wikipedia (HTML).
   * @returns 
   */
  async downloadRandomArticle(url?: string): Promise<any> {
    if (url !== undefined && !url?.includes('wikipedia.org/wiki/')) {
      throw new Error(INVALID_URL_PROVIDED_ERROR);
    }
    const queryUrl: string = url ?? this.defaultQueryUrl;
    const response = await fetch(queryUrl, { redirect: 'follow' });
    return response.text();
  };
}