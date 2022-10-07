import { HTMLElement, parse } from "node-html-parser";

export const INVALID_URL_PROVIDED_ERROR: string = 'ArticleDownloader - Invalid URL provided. Only Wikipedia URLs are allowed.';
export const UNABLE_TO_PARSE_HTML: string = 'ArticleDownloader - Unable to parse file into HTML.';

export interface IArticleDownloader {
  downloadRandomArticle: (url?: string) => Promise<HTMLElement>;
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
  async downloadRandomArticle(url?: string): Promise<HTMLElement> {
    if (url !== undefined && !url?.includes('wikipedia.org/wiki/')) {
      throw new Error(INVALID_URL_PROVIDED_ERROR);
    }
    const queryUrl: string = url ?? this.defaultQueryUrl;
    const rawResponse: Response = await fetch(queryUrl, { redirect: 'follow' });
    const textResponse: string = await rawResponse.text();
    try {
      return parse(textResponse);
    } catch {
      throw new Error(UNABLE_TO_PARSE_HTML);
    }
  };
}