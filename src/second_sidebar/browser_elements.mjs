import { XULElement } from "./xul/base/xul_element.mjs";

export class BrowserElements {
  static root = new XULElement({ element: window.document.documentElement });
  static browser = new XULElement({
    element: document.getElementById("browser"),
  });

  static tabbrowserTabbox = new XULElement({
    element: document.getElementById("tabbrowser-tabbox"),
  });

  static get customizationContainer() {
    return new XULElement({
      element: document.getElementById("customization-container"),
    });
  }

  static get notificationPopup() {
    return new XULElement({
      element: document.getElementById("notification-popup"),
    });
  }

  static get contentAreaContextMenu() {
    return new XULElement({
      element: document.getElementById("contentAreaContextMenu"),
    });
  }

  static get menuApiPopup() {
    return new XULElement({
      element: document.querySelector('menupopup[menu-api="true"]'),
    });
  }
}
