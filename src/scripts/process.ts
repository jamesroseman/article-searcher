import ArticleProcessor from "../utils/ArticleProcessor";

async function processAllArticles() {
  const processor: ArticleProcessor = new ArticleProcessor();
  await processor.processAllArticles();
}

processAllArticles();