import { HTMLElement } from "node-html-parser";
import WordFrequencyMap, { FrequencyMap } from "./WordFrequencyMap"

export type HeadingBodyFrequencyMap = {
  headings: FrequencyMap,
  body: FrequencyMap,
}

interface IArticleFrequencyMap {
  map: () => HeadingBodyFrequencyMap,
}

/**
 * An interface for transforming HTML articles into header and body word frequency maps.
 */
export default class ArticleFrequencyMap implements IArticleFrequencyMap {
  constructor(article: HTMLElement, window?: number) {
    this.headingBodyFrequencyMap = this.createHeadingBodyFrequencyMap(article, window);
  }

  private headingBodyFrequencyMap: HeadingBodyFrequencyMap;

  /**
   * From a provided HTML article, create a header-body frequency map of words.
   */
  private createHeadingBodyFrequencyMap(article: HTMLElement, window: number = 1): HeadingBodyFrequencyMap {
    const headings: string = article
      .querySelectorAll('h1, h2, h3, h4, h5, h6')
      .map((element: HTMLElement) => element.text)
      .join(' ');
    const headingsMap: WordFrequencyMap = new WordFrequencyMap(headings, window);
    
    const body: string = article
      .querySelectorAll('p')
      .map((element: HTMLElement) => element.text)
      .join(' ');
    const bodyMap: WordFrequencyMap = new WordFrequencyMap(body, window);
    
    return {
      headings: headingsMap.map(),
      body: bodyMap.map(),
    };
  }

  map(): HeadingBodyFrequencyMap {
    return this.headingBodyFrequencyMap;
  };
}