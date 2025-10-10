export class FileProtocolHandler {
  static #raw = Services.io
    .getProtocolHandler("file")
    .QueryInterface(Ci.nsIFileProtocolHandler);

  /**
   *
   * @param {any} dir
   * @returns {string}
   */
  static getURLSpecFromDir(dir) {
    return this.#raw.getURLSpecFromDir(dir);
  }
}
