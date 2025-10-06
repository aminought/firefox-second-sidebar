export class PathUtilsWrapper {
  /**
   *
   * @param {string} path
   * @returns {string[]}
   */
  static split(path) {
    return PathUtils.split(path);
  }

  /**
   *
   * @param {string[]} parts
   * @returns {string}
   */
  static join(parts) {
    return PathUtils.join(...parts);
  }
}
