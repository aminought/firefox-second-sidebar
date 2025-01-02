/* eslint-disable no-unused-vars */
import { SidebarController } from "./sidebar.mjs";
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
   * @param {SidebarController} sidebarController
   */
  setupDependencies(sidebarMainSettingsController, sidebarController) {
    this.sidebarMainSettingsController = sidebarMainSettingsController;
    this.sidebarController = sidebarController;
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
    this.sidebarController.updateAbsolutePosition();
  }

  /**
   *
   * @returns {string}
   */
  getWidth() {
    return Math.round(this.sidebarMain.getBoundingClientRect().width) + "px";
  }
}
