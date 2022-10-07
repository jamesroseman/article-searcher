import { HTMLElement, parse } from "node-html-parser";
import ArticleFrequencyMap, { HeadingBodyFrequencyMap } from "../ArticleFrequencyMap";

describe('ArticleFrequencyMap', () => {
  describe('map', () => {
    it('should create a map given an article without a window', () => {
      const testHTMLStr: string = `
        <html>
          <div id="content">
            <h1>The title title title, three times!</h1>
            <h2>Another title.</h2>
            <p>This is the paragraph paragraph paragraph. It might have a title, too.</p>
          </div>
        </html>
      `;
      const testArticle: HTMLElement = parse(testHTMLStr);
      const expectedFrequencyMap: HeadingBodyFrequencyMap = {
        headings: {
          "the": 1, "title": 4, "three": 1, "times": 1, "another": 1,
        },
        body: {
          "this": 1, "is": 1, "the": 1, "paragraph": 3, "it": 1, "might": 1, "have": 1,
          "title": 1, "too": 1,
        }
      }
      const articleFreqMap: ArticleFrequencyMap = new ArticleFrequencyMap(testArticle);
      const actualFreqMap: HeadingBodyFrequencyMap = articleFreqMap.map();
      expect(actualFreqMap).toEqual(expectedFrequencyMap);
    });

    it('should create a map given an article with a window', () => {
      const testHTMLStr: string = `
        <html>
          <div id="content">
            <h1>The title title title, three times!</h1>
            <h2>Another title.</h2>
            <p>This is the paragraph paragraph paragraph. It might have a title, too.</p>
          </div>
        </html>
      `;
      const testArticle: HTMLElement = parse(testHTMLStr);
      const expectedFrequencyMap: HeadingBodyFrequencyMap = {
        headings: {
          "the": 1, "the title": 1, "the title title": 1,
          "title": 4, "title title": 2, "title title title": 1,
          "title title three": 1, "title three": 1, "title three times": 1,
          "three": 1, "three times": 1, "three times another": 1,
          "times": 1, "times another": 1, "times another title": 1, 
          "another": 1, "another title": 1, 
        },
        body: {
          "this": 1, "this is": 1, "this is the": 1,
          "is": 1, "is the": 1, "is the paragraph": 1, 
          "the": 1, "the paragraph": 1, "the paragraph paragraph": 1,
          "paragraph paragraph": 2, "paragraph paragraph paragraph": 1, "paragraph paragraph it": 1,
          "paragraph": 3, "paragraph it": 1, "paragraph it might": 1, 
          "it": 1, "it might": 1, "it might have": 1, 
          "might": 1, "might have": 1, "might have title": 1,
          "have": 1, "have title": 1, "have title too": 1, 
          "title": 1, "title too": 1, 
          "too": 1,
        }
      }
      const testWindow: number = 3;
      const articleFreqMap: ArticleFrequencyMap = new ArticleFrequencyMap(testArticle, testWindow);
      const actualFreqMap: HeadingBodyFrequencyMap = articleFreqMap.map();
      expect(actualFreqMap).toEqual(expectedFrequencyMap);
    });
  });
});