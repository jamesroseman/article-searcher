import { ArticleWordCount } from "../../types/ArticleWordCount";
import SearchRelevanceScore, { ArticleRanking } from "../SearchRelevanceScore";

describe('SearchRelevanceScore', () => {
  let score: SearchRelevanceScore;

  describe('getScore', () => {
    beforeEach(() => {
      score = new SearchRelevanceScore();
    });

    it('should return a list of one URL if given only one', () => {
      const testWCs: ArticleWordCount[][] = [
        [
          { word: "shepard", url: "URL-1", freq: 2, isHeading: true },
        ]
      ];
      const expectedRankings: ArticleRanking[] = [
        { url: "URL-1", ranking: 40000 },
      ];
      const actualRankings: ArticleRanking[] = score.getScore(testWCs);
      expect(actualRankings).toEqual(expectedRankings);
    });

    it('should return the correct list URLs', () => {
      const testWCs: ArticleWordCount[][] = [
        [
          { word: "shepard", url: "URL-1", freq: 2, isHeading: false },
          { word: "shepard", url: "URL-2", freq: 5, isHeading: false },
        ],
        [
          { word: "shepard fairey", url: "URL-1", freq: 4, isHeading: false },
          { word: "shepard fairey", url: "URL-2", freq: 1, isHeading: false },
        ]
      ];
      const expectedRankings: ArticleRanking[] = [
        { url: "URL-1", ranking: 160 },
        { url: "URL-2", ranking: 130 },
      ];
      const actualRankings: ArticleRanking[] = score.getScore(testWCs);
      expect(actualRankings).toEqual(expectedRankings);
    });
  });
});