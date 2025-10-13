export class SearchService {
  /**
   *
   * @param {string} query
   * @returns {Promise<string?>}
   */
  static async getDefaulSubmissionUrl(query) {
    const defaultEngine = Services.search.defaultEngine;
    if (!defaultEngine) return null;
    const submission = await defaultEngine.getSubmission(query);
    return submission.uri.spec;
  }
}
