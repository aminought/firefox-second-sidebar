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
   * @param {XULElement} browser
   */
  constructor(sidebarMain, sidebarMainMenuPopup, browser) {
    this.sidebarMain = sidebarMain;
    this.sidebarMainMenuPopup = sidebarMainMenuPopup;
    this.browser = browser;

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

    this.sidebarMainMenuPopup.listenCustomizeItemClick(() => {
      gCustomizeMode.enter();
    });
  }

  /**
   *
   * @returns {string}
   */
  getPadding() {
    const value = this.browser.getProperty("--sb2-main-padding");
    return value.match(/var\(--space-([^)]+)\)/)[1];
  }

  /**
   *
   * @param {string} value
   */
  setPadding(value) {
    this.browser.setProperty("--sb2-main-padding", `var(--space-${value})`);
  }

  getActualWidth() {
    return this.sidebarMain.getBoundingClientRect().width;
  }
}
