import { Datastore, Query } from '@google-cloud/datastore';
import { ArticleWordCount } from '../types/ArticleWordCount';
import { DatastoreKinds } from '../types/Datastore';
import { fetchObjects } from './GoogleStorageUtils';

import SearchRelevanceScore, { ArticleRanking } from "./SearchRelevanceScore";

export interface IArticleSearcher {
  createSearchPermutations: (searchTerm: string) => string[][],
  search: (searchTerm: string) => Promise<ArticleRanking[]>,
}

/**
 * An interface for searching stored articles by search term.
 */
export default class ArticleSearcher implements IArticleSearcher {
  constructor() {
    this.searchRelevanceScore = new SearchRelevanceScore();
    this.datastore = new Datastore();
  }

  private searchRelevanceScore: SearchRelevanceScore;
  private datastore: Datastore;

  /**
   * Given a search term, return the ordered list of rankings of articles which
   * best match that search term.
   */
  async search(searchTerm: string): Promise<ArticleRanking[]> {
    const searchTermPermutations: string[][] = this.createSearchPermutations(searchTerm);

    // Transform the search term permutations into word frequencies.
    const wordCounts: ArticleWordCount[][] = await Promise.all(
      searchTermPermutations.map((searchTerms: string[]) => this.fetchAndFlattenSearchTermsWordCounts(searchTerms)),
    );

    // Get the ranking scores from those word counts.
    return this.searchRelevanceScore.getScore(wordCounts);
  }

  /**
   * Given a search term, creates an ordered permutation of the individual words
   * in the search term.
   */
  createSearchPermutations(searchTerm: string): string[][] {
    const lowerSearchTerm: string = searchTerm.toLocaleLowerCase();

    // Split the search terms into its ordered permutations.
    const terms: string[] = lowerSearchTerm.split(' ');
    const allTermsMap: { [len: number]: string[] } = {};
    for (let i=0; i<terms.length; i+=1) {
      if (!Object.prototype.hasOwnProperty.call(allTermsMap, 0)) {
        allTermsMap[0] = [];
      }
      allTermsMap[0].push(terms[i]);

      let accTerm: string = terms[i];
      for (let j=i+1; j<terms.length; j+=1) {
        const length: number = j - i;
        accTerm = `${accTerm} ${terms[j]}`;

        if (!Object.prototype.hasOwnProperty.call(allTermsMap, length)) {
          allTermsMap[length] = [];
        }
        allTermsMap[length].push(accTerm);
      }
    }

    // Assemble the final ordered permutation list from the map.
    const permutations: string[][] = [];
    for (let i=0; i<terms.length; i++) {
      permutations.push(allTermsMap[i]);
    }

    return permutations;
  }

  /**
   * Helper function for fetching word counts of search terms.
   */
  private async fetchSearchTermWordCounts(searchTerm: string, isHeading: boolean): Promise<ArticleWordCount[]> {
    const { datastore } = this;
    const kind: string = isHeading ? DatastoreKinds.HeadingWordCount : DatastoreKinds.BodyWordCount;
    const query: Query = datastore.createQuery(kind).filter("word", "=", searchTerm);
    const wcs: ArticleWordCount[] = await fetchObjects<ArticleWordCount>(datastore, query);
    return wcs.map((wc: ArticleWordCount) => ({
      word: wc.word,
      url: wc.url,
      freq: wc.freq,
      isHeading,
    }));
  }

  /**
   * Helper function for transforming a list of search terms into a flattened list of word counts.
   */
  private async fetchAndFlattenSearchTermsWordCounts(searchTerms: string[]): Promise<ArticleWordCount[]> {
    const unflattedWordCounts: ArticleWordCount[][] = await Promise.all(
      searchTerms.map(async (searchTerm: string) => {
        const headingWCs: ArticleWordCount[] = await this.fetchSearchTermWordCounts(searchTerm, true);
        const bodyWCs: ArticleWordCount[] = await this.fetchSearchTermWordCounts(searchTerm, false);
        return [...headingWCs, ...bodyWCs];
      }),
    );
    return unflattedWordCounts.flat();
  }
}