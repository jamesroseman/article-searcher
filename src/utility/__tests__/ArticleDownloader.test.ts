import * as fs from 'fs';
import * as path from 'path';
import { HTMLElement, parse } from 'node-html-parser';
import ArticleDownloader, { INVALID_URL_PROVIDED_ERROR } from "../ArticleDownloader";

describe('ArticleDownloader', () => {
  let downloader: ArticleDownloader;

  beforeEach(() => {
    downloader = new ArticleDownloader();
  });

  describe('downloadRandomArticle', () => {
    it('should throw if non-Wikipedia URL is provided', async () => {
      const invalidUrl: string = 'www.google.com/whatever';
      await expect(downloader.downloadRandomArticle(invalidUrl))
        .rejects
        .toThrow(INVALID_URL_PROVIDED_ERROR)
    });

    it('should successfully download a provided article', async () => {
      const validUrl: string = 'https://en.wikipedia.org/wiki/Shepard_Fairey';
      const expectedHTMLPath = path.resolve(__dirname, './constants/ArticleDownloader_ShepardFaireyWikipediaPage.html');
      const expectedHTMLBuffer: Buffer = fs.readFileSync(expectedHTMLPath);
      const expectedHTMLStr: string = expectedHTMLBuffer.toString();
      const expectedHTML: HTMLElement = parse(expectedHTMLStr);
      const actualHTML = await downloader.downloadRandomArticle(validUrl);
      expect(actualHTML.text).toEqual(expectedHTML.text);
    });

    it('should successfully download a random article', async () => {
      const actualHTML = await downloader.downloadRandomArticle();
      expect(actualHTML.text.length).toBeGreaterThan(100);
    });
  });
});