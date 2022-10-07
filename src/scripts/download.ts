import ArticleDownloader from "../utils/ArticleDownloader";

function timer(ms: number) { return new Promise(res => setTimeout(res, ms)); }

async function downloadArticle() {
  const articleDownloader: ArticleDownloader = new ArticleDownloader();
  await timer(3000);
  await articleDownloader.downloadRandomArticle();
}

async function downloadArticles() {
  for (let i=1; i<=200; i+=1) {
    console.log(`Downloading article #${i}`);
    await downloadArticle();
  }
}

downloadArticles();