import * as fs from 'fs';
import ArticleDownloader from './utility/ArticleDownloader';

async function main() {
  const downloader: ArticleDownloader = new ArticleDownloader();
  const article = await downloader.downloadRandomArticle('https://en.wikipedia.org/wiki/Shepard_Fairey');
  // console.log(article);
}

main();