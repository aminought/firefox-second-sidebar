export class TabPanelsWrapper {
  #tabpanels;

  constructor(tabpanels) {
    this.#tabpanels = tabpanels;
  }

  get raw() {
    return this.#tabpanels;
  }

  /**
   *
   * @param {string} type
   * @param {function(Event):void} callback
   */
  addEventListener(type, callback) {
    this.raw.addEventListener(type, callback);
  }
}
