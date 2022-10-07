import WordFrequencyMap, { FrequencyMap } from "../WordFrequencyMap";

describe('WordFrequencyMap', () => {
  describe('map', () => {
    it ('should create a frequency map given a string', () => {
      const testWords: string = `
        Shepard Fairey has always been open about social and political topics and often donates \
        and creates artwork in order to promote awareness of these social issues and contributes \
        directly to these causes.
      `;
      const expectedFrequencyMap: FrequencyMap = {
        about: 1, always: 1, and: 4, artwork: 1,
        awareness: 1, been: 1, causes: 1, contributes: 1, 
        creates: 1, directly: 1, donates: 1, fairey: 1,
        has: 1, in: 1, issues: 1, of: 1, 
        often: 1, open: 1, order: 1, political: 1, 
        promote: 1, shepard: 1, social: 2, these: 2, 
        to: 2, topics: 1, 
      };
      const wordFrequencyMap: WordFrequencyMap = new WordFrequencyMap(testWords);
      const actualFrequencyMap: FrequencyMap = wordFrequencyMap.map();
      expect(actualFrequencyMap).toEqual(expectedFrequencyMap);
    });

    it ('should create a frequency map given a string and window', () => {
      const testWords: string = `
        Shepard Fairey has always been open about social and political topics.
      `;
      const testWindow: number = 3;
      const expectedFrequencyMap: FrequencyMap = {
        "shepard": 1, "shepard fairey": 1, "shepard fairey has": 1,
        "fairey": 1, "fairey has": 1, "fairey has always": 1,
        "has": 1, "has always": 1, "has always been": 1,
        "always": 1, "always been": 1, "always been open": 1,
        "been": 1, "been open": 1, "been open about": 1, 
        "open": 1, "open about": 1, "open about social": 1, 
        "about": 1, "about social": 1, "about social and": 1, 
        "social": 1, "social and": 1, "social and political": 1,
        "and": 1, "and political": 1, "and political topics": 1,
        "political": 1, "political topics": 1,
        "topics": 1,
      };
      const wordFrequencyMap: WordFrequencyMap = new WordFrequencyMap(testWords, testWindow);
      const actualFrequencyMap: FrequencyMap = wordFrequencyMap.map();
      expect(actualFrequencyMap).toEqual(expectedFrequencyMap);
    });
  });
});