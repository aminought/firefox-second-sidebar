export class IOUtilsWrapper {
  /**
   *
   * @param {string} path
   * @param {string} data
   */
  static async writeUTF8(path, data) {
    const options = { tmpPath: path + ".tmp" };
    await IOUtils.writeUTF8(path, data, options);
  }

  /**
   *
   * @param {string} path
   */
  static async remove(path) {
    await IOUtils.remove(path);
  }
}
