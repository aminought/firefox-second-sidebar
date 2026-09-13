export class SearchService {
  /**
   *
   * @param {string} query
   * @returns {Promise<string?>}
   */
  static async getDefaultSubmissionUrl(query) {
    const defaultEngine = await Services.search.getDefault();
    if (!defaultEngine) return null;
    const submission = defaultEngine.getSubmission(query);
    return submission?.uri?.spec ?? null;
  }
}
