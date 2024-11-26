import { Splitter } from "./base/splitter.mjs";

export class SidebarSplitter extends Splitter {
  /**
   *
   * @param {object} params
   * @param {string} params.id
   */
  constructor({ id = null } = {}) {
    super({ id, classList: ["sidebar-splitter"] });
    this.setResizeBefore("none").setResizeAfter("sibling");
  }

  /**
   *
   * @param {function():void} callback
   */
  listenWidthChange(callback) {
    this.addEventListener("mouseup", () => {
      callback();
    });
  }
}
