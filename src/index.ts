import ArticleDownloader from "./utils/ArticleDownloader";

async function main() {
  const ad: ArticleDownloader = new ArticleDownloader();
  const response: Response = await ad.downloadRandomArticle();
}

main();