import { SidebarControllers } from "../sidebar_controllers.mjs";
import { SidebarElements } from "../sidebar_elements.mjs";
import { XULElement } from "../xul/base/xul_element.mjs";
import { gCustomizeModeWrapper } from "../wrappers/g_customize_mode.mjs";
import { gNavToolboxWrapper } from "../wrappers/g_nav_toolbox.mjs";
import { isRightMouseButton } from "../utils/buttons.mjs";
import { parseFunction } from "../utils/parsers.mjs";

export class SidebarMainController {
  constructor() {
    this.sidebarMain = SidebarElements.sidebarMain;
    this.sidebarCollapseButton = SidebarElements.sidebarCollapseButton;
    this.sidebarMainMenuPopup = SidebarElements.sidebarMainMenuPopup;
    this.root = new XULElement({ element: document.documentElement });
    this.#setupGlobalListeners();
    this.#setupListeners();
  }

  #setupGlobalListeners() {
    fetch("chrome://browser/content/navigator-toolbox.js").then((response) => {
      response.text().then((moduleSource) => {
        const matches = moduleSource.matchAll(/\s{4}function.*?^\s{4}}/gms);
        for (const match of matches) {
          const functionSource = match[0];
          const parsedFunction = parseFunction(functionSource);
          const eventName = parsedFunction.name
            .toLowerCase()
            .replace(/^on/, "");
          this.sidebarMain.addEventListener(eventName, parsedFunction.func);
        }
      });
    });
  }

  #setupListeners() {
    this.sidebarMain.addEventListener("mousedown", (event) => {
      if (isRightMouseButton(event)) {
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
      }
    });

    this.sidebarMainMenuPopup.listenSettingsItemClick(() => {
      SidebarControllers.sidebarMainSettingsController.openPopup(
        this.mouseX,
        this.mouseY,
      );
    });

    this.sidebarMainMenuPopup.listenCustomizeItemClick(() => {
      gCustomizeModeWrapper.enter();
    });

    const browser = new XULElement({
      element: document.getElementById("browser"),
    });
    gNavToolboxWrapper.addEventListener("customizationready", () => {
      browser.show();
    });
    gNavToolboxWrapper.addEventListener("aftercustomization", () => {
      const springs = document.querySelectorAll("#sb2-main toolbarspring");
      for (const spring of springs) {
        spring.removeAttribute("context");
      }
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
    SidebarControllers.sidebarController.updateAbsolutePosition();
  }

  /**
   *
   * @returns {string}
   */
  getWidth() {
    return Math.round(this.sidebarMain.getBoundingClientRect().width) + "px";
  }

  /**
   *
   * @returns {boolean}
   */
  collapsed() {
    const zeros = ["0px", ""];
    const marginRight = this.sidebarMain.getProperty("margin-right");
    const marginLeft = this.sidebarMain.getProperty("margin-left");
    return !zeros.includes(marginRight) || !zeros.includes(marginLeft);
  }

  collapse() {
    const position = SidebarControllers.sidebarController.getPosition();
    this.sidebarMain.setProperty(
      position === "right" ? "margin-right" : "margin-left",
      -this.sidebarMain.getBoundingClientRect().width + "px",
    );
    this.sidebarCollapseButton.setOpen(false);
  }

  uncollapse() {
    this.sidebarMain.setProperty("margin-right", "0px");
    this.sidebarMain.setProperty("margin-left", "0px");
    this.sidebarCollapseButton.setOpen(true);
  }
}
