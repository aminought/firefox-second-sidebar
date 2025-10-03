import { Splitter } from "./base/splitter.mjs";

export class SidebarSplitter extends Splitter {
  constructor() {
    super({ id: "sb2-splitter", classList: ["sidebar-splitter"] });
    this.setResizeBefore("sibling").setResizeAfter("none").hide();
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
