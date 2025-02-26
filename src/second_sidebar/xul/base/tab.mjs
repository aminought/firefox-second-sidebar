import { Browser } from "./browser.mjs";
import { XULElement } from "./xul_element.mjs";

export class Tab extends XULElement {
  /**
   *
   * @param {object} params
   * @param {string?} params.id
   * @param {Array<string>} params.classList
   * @param {HTMLElement?} params.element
   */
  constructor({ id = null, classList = [], element } = {}) {
    super({ tag: "tab", id, classList, element });
  }

  /**
   * @returns {Browser?}
   */
  get linkedBrowser() {
    return new Browser({ element: this.element.linkedBrowser });
  }

  /**
   *
   * @returns {boolean}
   */
  get selected() {
    return this.element.selected ?? false;
  }

  /**
   * @returns {boolean}
   */
  get soundPlaying() {
    return this.element.soundPlaying;
  }

  /**
   * @returns {boolean}
   */
  get muted() {
    return this.element.muted;
  }

  /**
   *
   * @returns {Tab}
   */
  toggleMuteAudio() {
    this.element.toggleMuteAudio();
    return this;
  }
}
