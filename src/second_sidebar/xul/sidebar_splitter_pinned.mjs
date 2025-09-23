import { SidebarSplitter } from "./sidebar_splitter.mjs";

export class SidebarSplitterPinned extends SidebarSplitter {
  constructor() {
    super({ id: "sb2-splitter-pinned" });
    this.setAttribute("hidden", true);
  }
}
