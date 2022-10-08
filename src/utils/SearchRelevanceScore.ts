import { ArticleWordCount } from "../types/ArticleWordCount";

export type ArticleRanking = {
  url: string;
  ranking: number;
}

type ArticleRankingMap = {
  [url: string]: number,
}

export interface ISearchRelevanceScore {
  getScore: (wcs: ArticleWordCount[][]) => ArticleRanking[],
}

/**
 * An interface for ranking search results based on a search term and frequency maps.
 */
export default class SearchRelevanceScore implements ISearchRelevanceScore {
  /**
   * The algorithm which determines a ranking order of URLs to be returned based on 
   * a search term.
   * @param wcs A 2d list of word counts, organized by how many words in the search term
   *                   can be found in the word count. i=0 indicates 1 word in common between the 
   *                   search term and the word in the word count, and on. 
   * @returns A list of ArticleRanking objects, which include the URL and score of the article.
   */
  getScore(wcs: ArticleWordCount[][]): ArticleRanking[] {
    const rankings: ArticleRanking[] = wcs.reduce(
      (rankings: ArticleRanking[], wordCounts: ArticleWordCount[], index: number) => {
        wordCounts.forEach((wordCount: ArticleWordCount) => {
          rankings.push({
            url: wordCount.url,
            ranking: this.computeScore(wordCount.word, wordCount.isHeading, index+1, wordCount.freq),
          })
        });
        return rankings;
      },
      []
    );
    // Merge the ranking scores for URLs.
    const dedupedRankingsMap: ArticleRankingMap = rankings.reduce(
      (map: ArticleRankingMap, ranking: ArticleRanking) => {
        if (!Object.prototype.hasOwnProperty.call(map, ranking.url)) {
          map[ranking.url] = 0;
        }
        map[ranking.url] += ranking.ranking;
        return map;
      },
      {}
    );
    // Transform the map back into a list.
    // Filter out any rankings with low scores.
    // Sort by ranking.
    return Object
      .keys(dedupedRankingsMap)
      .filter((key: string) => dedupedRankingsMap[key] > 100)
      .map(
        (key: string) => ({ url: key, ranking: dedupedRankingsMap[key] } as ArticleRanking),
      )
      .sort(
        (rankingA: ArticleRanking, rankingB: ArticleRanking) => rankingB.ranking - rankingA.ranking,
      );
  }

  private computeScore(
    word: string,
    isHeading: boolean,
    numberOfWordsInCommon: number,
    frequency: number,
  ): number {
    // If the search term includes common conjunctions, we should ignore these conjuctions as
    // stand-alone search terms, or our results will likely be skewed.
    const commonWords: string[] = ["the", "and", "but", "if"];
    if (commonWords.includes(word)) {
      return 0;
    }
    const headingModifier: number = isHeading ? 1000 : 1;
    const commonModifier: number = (numberOfWordsInCommon + 1) * 10;
    if (word === "south dakota" || word === "american football") {
      console.log(word, isHeading, numberOfWordsInCommon, frequency, (headingModifier * commonModifier * frequency));
    }
    return headingModifier * commonModifier * frequency;
  }
}