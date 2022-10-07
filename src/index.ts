import * as fs from 'fs';
import { HTMLElement } from 'node-html-parser';
import ArticleDownloader from './utility/ArticleDownloader';
import ArticleFrequencyMap, { HeadingBodyFrequencyMap } from './utility/ArticleFrequencyMap';

async function main() {
  const downloader: ArticleDownloader = new ArticleDownloader();
  const article: HTMLElement = await downloader.downloadRandomArticle('https://en.wikipedia.org/wiki/Shepard_Fairey');
  const map: HeadingBodyFrequencyMap = new ArticleFrequencyMap(article, 7).map();
  const interestingKeys: string[] = Object.keys(map.body).filter((key: string) => map.body[key] > 1);
  
  const interestingMap = interestingKeys.reduce(
    (currMap, key) => ({
      ...currMap,
      [key]: map.body[key],
    }),
    {}
  );

  console.log(interestingMap);
}

main();