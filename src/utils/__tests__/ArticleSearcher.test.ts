import ArticleSearcher from "../ArticleSearcher";

describe('ArticleSearcher', () => {
  describe('createSearchPermutations', () => {
    it('should create permutations for a multi-word search term', () => {
      const searcher: ArticleSearcher = new ArticleSearcher();
      const testSearchTerm: string = "Shepard Fairey Artist";
      const expectedPermutation: string[][] = [
        ["shepard", "fairey", "artist"],
        ["shepard fairey", "fairey artist"],
        ["shepard fairey artist"],
      ];
      const actualPermutation: string[][] = searcher.createSearchPermutations(testSearchTerm);
      expect(actualPermutation).toEqual(expectedPermutation);
    });
  });
});