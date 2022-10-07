export type FrequencyMap = {
  [word: string]: number,
}

interface IWordFrequencyMap {
  map: () => FrequencyMap;
}

/**
 * An interface for transforming strings into word frequency maps.
 */
export default class WordFrequencyMap implements IWordFrequencyMap {
  constructor(words: string, window?: number) {
    this.frequencyMap = this.createFrequencyMap(words, window);
  }

  private frequencyMap: FrequencyMap;

  /**
   * From a provided string, create a frequency map of words separated by whitespace.
   */
  private createFrequencyMap(words: string, window: number = 1): FrequencyMap {
    const wordsArr: string[] = words
      .split(' ')
      .map((word: string) => word
        .trim()
        .replace("'", "")
        .replace('"', "")
        .replace("/", "")
        .replace(".", "")
        .replace("!", "")
        .replace(",", "")
        .replace("?", "")
        .replace(":", "")
        .replace("[", "")
        .replace("]", "")
      )
      .map((word: string) => word.toLocaleLowerCase())
      .filter((word: string) => word.length > 1);
    
    const frequencyMap: FrequencyMap = wordsArr.reduce(
      (map: FrequencyMap, word: string, index: number) => {
        // Adjust the frequency map for the current word.
        if (!Object.prototype.hasOwnProperty.call(map, word)) {
          map[word] = 0;
        }
        map[word] += 1;

        // If there's a window, add all substrings within the window.
        if (window > 1) {
          let growingWord: string = word;
          for (let i=1; i<window; i+=1) {
            const newIndex: number = index + i;
            if (newIndex < wordsArr.length) {
              growingWord = `${growingWord} ${wordsArr[index+i]}`;
              if (!Object.prototype.hasOwnProperty.call(map, growingWord)) {
                map[growingWord] = 0;
              }
              map[growingWord] += 1;
            }
          } 
        }
        return map;
      },
      {}
    );

    return frequencyMap;
  }

  map(): FrequencyMap {
    return this.frequencyMap;
  }
}