/**
 * Represents a word, its frequency, and the article in which it can be found.
 */
export type ArticleWordCount = {
  url: string;
  word: string;
  freq: number;
  isHeading: boolean;
}

export function getStorageIDFromWordCount(wc: ArticleWordCount): string {
  const { word, freq, url } = wc;
  return `${word}-${freq}-${url}`;
}