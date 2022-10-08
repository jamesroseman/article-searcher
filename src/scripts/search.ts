import ArticleSearcher from '../utils/ArticleSearcher';
import { ArticleRanking } from '../utils/SearchRelevanceScore';

async function searchArticles() {
  // Argument parsing.
  const args = process.argv.slice(2);
  if (args.length !== 1) {
    console.error('Invalid parameters -- search "[search term]"');
  }
  const searchTerm: string = args[0];
  console.log(`Searching: "${searchTerm}"`);
  const searcher: ArticleSearcher = new ArticleSearcher();
  const rankings: ArticleRanking[] = await searcher.search(searchTerm);
  console.log(rankings);
}

searchArticles();