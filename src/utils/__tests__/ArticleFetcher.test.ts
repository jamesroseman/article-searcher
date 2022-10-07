import * as fs from 'fs';
import * as path from 'path';
import { HTMLElement, parse } from 'node-html-parser';
import ArticleFetcher, { INVALID_URL_PROVIDED_ERROR } from "../ArticleFetcher";

describe('ArticleDownloader', () => {
  let downloader: ArticleFetcher;

  beforeEach(() => {
    downloader = new ArticleFetcher();
  });

  describe('downloadRandomArticle', () => {
    it('should throw if non-Wikipedia URL is provided', async () => {
      const invalidUrl: string = 'www.google.com/whatever';
      await expect(downloader.fetchRandomArticle(invalidUrl))
        .rejects
        .toThrow(INVALID_URL_PROVIDED_ERROR)
    });

    it('should successfully download a provided article', async () => {
      const validUrl: string = 'https://en.wikipedia.org/wiki/Shepard_Fairey';
      const expectedHTMLPath = path.resolve(__dirname, './constants/ArticleDownloader_ShepardFaireyWikipediaPage.html');
      const expectedHTMLBuffer: Buffer = fs.readFileSync(expectedHTMLPath);
      const expectedHTMLStr: string = expectedHTMLBuffer.toString();
      const expectedHTML: HTMLElement = parse(expectedHTMLStr);
      const actualResponse: Response = await downloader.fetchRandomArticle(validUrl);
      const actualHTMLStr: string = await actualResponse.text();
      const actualHTML: HTMLElement = parse(actualHTMLStr);
      expect(actualHTML.text).toEqual(expectedHTML.text);
    });

    it('should successfully download a random article', async () => {
      const actualResponse: Response = await downloader.fetchRandomArticle();
      const actualHTMLStr: string = await actualResponse.text();
      const actualHTML: HTMLElement = parse(actualHTMLStr);
      expect(actualHTML.text.length).toBeGreaterThan(100);
    });
  });
});