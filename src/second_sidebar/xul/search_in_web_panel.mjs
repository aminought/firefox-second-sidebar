import { MenuItem } from "./base/menuitem.mjs";
import { ellipsis } from "../utils/string.mjs";

export class SearchInWebPanelMenuItem extends MenuItem {
  constructor() {
    super({ id: "context-searchinwebpanel" });
  }

  /**
   *
   * @param {string} query
   * @returns {SearchInWebPanelMenuItem}
   */
  setSearchQuery(query) {
    this.setLabel(`Search "${ellipsis(query, 18)}" in Second Sidebar`);
    return this;
  }
}
