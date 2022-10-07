import * as fs from 'fs';
import { HTMLElement } from 'node-html-parser';
import { Storage } from '@google-cloud/storage';

import ArticleDownloader from './utils/ArticleDownloader';
import ArticleFrequencyMap, { HeadingBodyFrequencyMap } from './utils/ArticleFrequencyMap';
import { download } from './utils/GoogleStorageUtils';

async function main() {
  const storage: Storage = new Storage();
  const file: string = await download(storage, 'wikipedia_searcher_wikipedia_articles', 'abc.html');
  console.log(file);

  // const downloader: ArticleDownloader = new ArticleDownloader();
  // const article: HTMLElement = await downloader.downloadRandomArticle('https://en.wikipedia.org/wiki/Shepard_Fairey');
  // const map: HeadingBodyFrequencyMap = new ArticleFrequencyMap(article, 7).map();
  // const interestingKeys: string[] = Object.keys(map.body).filter((key: string) => map.body[key] > 1);
  
  // const interestingMap = interestingKeys.reduce(
  //   (currMap, key) => ({
  //     ...currMap,
  //     [key]: map.body[key],
  //   }),
  //   {}
  // );

  // console.log(interestingMap);
}

main();