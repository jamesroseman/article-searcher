export const INVALID_URL_PROVIDED_ERROR: string = 'ArticleDownloader - Invalid URL provided. Only Wikipedia URLs are allowed.';

export interface IArticleFetcher {
  fetchRandomArticle: (url?: string) => Promise<Response>;
}

/**
 * An interface for downloading the raw HTML of random Wikipedia articles.
 */
export default class ArticleFetcher implements IArticleFetcher {
  // This resolves to a random Wikipedia article.
  private defaultQueryUrl: string = 'https://en.wikipedia.org/wiki/Special:Random';
  
  /**
   * Fetches a random article from Wikipedia (HTML).
   * @returns 
   */
  async fetchRandomArticle(url?: string): Promise<Response> {
    if (url !== undefined && !url?.includes('wikipedia.org/wiki/')) {
      throw new Error(INVALID_URL_PROVIDED_ERROR);
    }
    const queryUrl: string = url ?? this.defaultQueryUrl;
    const rawResponse: Response = await fetch(queryUrl, { redirect: 'follow' });
    return rawResponse;
  };
}