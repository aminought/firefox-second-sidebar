import { XULElement } from "./xul/base/xul_element.mjs";

export class BrowserElements {
  static browser = new XULElement({
    element: document.getElementById("browser"),
  });
  static tabbrowserTabbox = new XULElement({
    element: document.getElementById("tabbrowser-tabbox"),
  });
}
