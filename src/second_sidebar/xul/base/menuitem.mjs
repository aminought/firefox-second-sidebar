import { Menu } from "./menu.mjs";

export class MenuItem extends Menu {
  /**
   *
   * @param {object} params
   * @param {string?} params.id
   * @param {Array<string>} params.classList
   */
  constructor({ id = null, classList = [] } = {}) {
    super({ tag: "menuitem", id, classList });
  }
}
