import { BrowserElements } from "../browser_elements.mjs";
import { ScriptSecurityManagerWrapper } from "../wrappers/script_security_manager.mjs";
import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";
import { SidebarMainPatcher } from "../patchers/sidebar_main_patcher.mjs";
import { XULElement } from "../xul/base/xul_element.mjs";
import { gCustomizeModeWrapper } from "../wrappers/g_customize_mode.mjs";
import { gNavToolboxWrapper } from "../wrappers/g_nav_toolbox.mjs";
import { isRightMouseButton } from "../utils/buttons.mjs";

export class SidebarMainController {
  constructor() {
    this.root = new XULElement({ element: document.documentElement });
    SidebarMainPatcher.patch();
    this.#setupListeners();
  }

  #setupListeners() {
    SidebarElements.sidebarMain.addEventListener("mousedown", (event) => {
      if (isRightMouseButton(event)) {
        this.mouseX = event.screenX;
        this.mouseY = event.screenY;
      }
    });

    SidebarElements.sidebarMainMenuPopup.listenSettingsItemClick(() => {
      SidebarControllers.sidebarMainSettingsController.openPopup(
        this.mouseX,
        this.mouseY,
      );
    });

    SidebarElements.sidebarMainMenuPopup.listenCustomizeItemClick(() => {
      gCustomizeModeWrapper.enter();
    });

    gNavToolboxWrapper.addEventListener("customizationready", () => {
      SidebarControllers.sidebarController.close();
      BrowserElements.tabbrowserTabbox.appendChild(
        BrowserElements.customizationContainer,
      );
    });

    gNavToolboxWrapper.addEventListener("aftercustomization", () => {
      const springs = document.querySelectorAll("#sb2-main toolbarspring");
      for (const spring of springs) {
        spring.removeAttribute("context");
      }
    });

    SidebarElements.sidebarMain.addEventListener("dragover", (event) => {
      event.preventDefault();
    });

    SidebarElements.sidebarMain.addEventListener("dragleave", (event) => {
      event.preventDefault();
    });

    SidebarElements.sidebarMain.addEventListener("drop", (event) => {
      event.preventDefault();
      const url =
        event.dataTransfer.getData("URL") ||
        event.dataTransfer.getData("text/uri-list");
      if (!url) return;
      SidebarControllers.webPanelNewController.createWebPanel(
        url,
        ScriptSecurityManagerWrapper.DEFAULT_USER_CONTEXT_ID,
        true,
      );
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
  }

  /**
   *
   * @returns {boolean}
   */
  collapsed() {
    const zeros = ["0px", ""];
    const marginRight = SidebarElements.sidebarMain.getProperty("margin-right");
    const marginLeft = SidebarElements.sidebarMain.getProperty("margin-left");
    return !zeros.includes(marginRight) || !zeros.includes(marginLeft);
  }

  collapse() {
    const position = SidebarElements.sidebarWrapper.getPosition();
    SidebarElements.sidebarMain.setProperty(
      position === "right" ? "margin-right" : "margin-left",
      -SidebarElements.sidebarMain.getBoundingClientRect().width + "px",
    );
    SidebarElements.sidebarCollapseButton.setOpen(false);
  }

  uncollapse() {
    SidebarElements.sidebarMain.setProperty("margin-right", "0px");
    SidebarElements.sidebarMain.setProperty("margin-left", "0px");
    SidebarElements.sidebarCollapseButton.setOpen(true);
  }
}
