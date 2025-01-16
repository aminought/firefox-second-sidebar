/* eslint-disable no-unused-vars */
import { SidebarController } from "./sidebar.mjs";
import { SidebarMain } from "../xul/sidebar_main.mjs";
import { SidebarMainMenuPopup } from "../xul/sidebar_main_menupopup.mjs";
import { SidebarMainSettingsController } from "./sidebar_main_settings.mjs";
import { XULElement } from "../xul/base/xul_element.mjs";
import { isRightMouseButton } from "../utils/buttons.mjs";
/* eslint-enable no-unused-vars */

export class SidebarMainController {
  /**
   *
   * @param {SidebarMain} sidebarMain
   * @param {SidebarMainMenuPopup} sidebarMainMenuPopup
   * @param {XULElement} root
   */
  constructor(sidebarMain, sidebarMainMenuPopup, root) {
    this.sidebarMain = sidebarMain;
    this.sidebarMainMenuPopup = sidebarMainMenuPopup;
    this.root = root;

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
    this.sidebarMain.addEventListener("mousedown", (event) => {
      if (isRightMouseButton(event)) {
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
      }
    });

    this.sidebarMainMenuPopup.listenSettingsItemClick(() => {
      this.sidebarMainSettingsController.openPopup(this.mouseX, this.mouseY);
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
    const value = this.root.getProperty("--sb2-main-padding");
    return value.match(/var\(--space-([^)]+)\)/)[1];
  }

  /**
   *
   * @param {string} value
   */
  setPadding(value) {
    this.root.setProperty("--sb2-main-padding", `var(--space-${value})`);
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
