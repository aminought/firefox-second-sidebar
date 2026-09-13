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
    const defaultEngine = await FirefoxSearchService.getDefault();
    if (!defaultEngine) return null;
    const submission = defaultEngine.getSubmission(query);
    return submission?.uri?.spec ?? null;
  }
}
