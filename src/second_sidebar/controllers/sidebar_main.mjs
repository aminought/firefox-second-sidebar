/* eslint-disable no-unused-vars */
import { SidebarMain } from "../xul/sidebar_main.mjs";
import { SidebarMainMenuPopup } from "../xul/sidebar_main_menupopup.mjs";
import { SidebarMainSettingsController } from "./sidebar_main_settings.mjs";
import { XULElement } from "../xul/base/xul_element.mjs";
/* eslint-enable no-unused-vars */

export class SidebarMainController {
  /**
   *
   * @param {SidebarMain} sidebarMain
   * @param {SidebarMainMenuPopup} sidebarMainMenuPopup
   */
  constructor(sidebarMain, sidebarMainMenuPopup) {
    this.sidebarMain = sidebarMain;
    this.sidebarMainMenuPopup = sidebarMainMenuPopup;

    this.#setupListeners();
  }

  /**
   *
   * @param {SidebarMainSettingsController} sidebarMainSettingsController
   */
  setupDependencies(sidebarMainSettingsController) {
    this.sidebarMainSettingsController = sidebarMainSettingsController;
  }

  #setupListeners() {
    this.sidebarMainMenuPopup.listenSettingsItemClick((event) => {
      this.sidebarMainSettingsController.openPopup(
        event.screenX,
        event.screenY,
      );
    });
  }

  /**
   *
   * @returns {string}
   */
  getWidth() {
    const browser = new XULElement(null, {
      element: document.querySelector("#browser"),
    });
    const value = browser.getProperty("--sidebar-2-main-padding");
    return value.match(/var\(--space-([^)]+)\)/)[1];
  }

  /**
   *
   * @param {string} width
   */
  setWidth(width) {
    const browser = new XULElement(null, {
      element: document.querySelector("#browser"),
    });
    browser.setProperty("--sidebar-2-main-padding", `var(--space-${width})`);
  }
}
