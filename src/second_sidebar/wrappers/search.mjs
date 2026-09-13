const { SearchService: FirefoxSearchService } = ChromeUtils.importESModule(
  "moz-src:///toolkit/components/search/SearchService.sys.mjs",
);

export class SearchService {
  /**
   *
   * @param {string} query
   * @returns {Promise<string?>}
   */
  static async getDefaultSubmissionUrl(query) {
    const searchService =
      typeof FirefoxSearchService.getDefault === "function"
        ? FirefoxSearchService
        : Services.search;
    if (!searchService) return null;
    const defaultEngine = await searchService.getDefault();
    if (!defaultEngine) return null;
    const submission = defaultEngine.getSubmission(query);
    return submission?.uri?.spec ?? null;
  }
}
