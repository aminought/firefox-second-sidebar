import { removeFile, writeFile } from "./utils/files.mjs";

const MODULE_RELATIVE_PATH = "fss/CustomizeMode.sys.mjs";

export class CustomizeModePatcher {
  static patch() {
    fetch("resource:///modules/CustomizeMode.sys.mjs").then((response) => {
      response.text().then(async (moduleSource) => {
        moduleSource = this.#patchModuleSource(moduleSource);
        await this.#replaceModule(moduleSource);
      });
    });
  }

  /**
   *
   * @param {string} moduleSource
   * @returns {string}
   */
  static #patchModuleSource(moduleSource) {
    return (
      moduleSource
        .replaceAll("CustomizableUI.getPlaceForItem", "getPlaceForItem")
        .replace(/([^/])(CustomizableUI)(\.)/gm, "$1window.$2$3")
        .replace("browser.hidden = true", "browser.hidden = false")
        .replace(
          "window.CustomizableUI.removeListener",
          "CustomizableUI.removeListener",
        ) + getPlaceForItem.toString()
    );
  }

  /**
   *
   * @param {string} moduleText
   */
  static async #replaceModule(moduleText) {
    const chromePath = await writeFile(MODULE_RELATIVE_PATH, moduleText);
    const module = await import(chromePath);
    ChromeUtils.defineLazyGetter(window, "gCustomizeMode", () => {
      return new module.CustomizeMode(window);
    });
    removeFile(MODULE_RELATIVE_PATH);
  }
}

/**
 *
 * @param {HTMLElement} aElement
 * @returns {string}
 */
function getPlaceForItem(aElement) {
  let place;
  let node = aElement;
  while (node && !place) {
    if (node.id == "sb2-main") {
      place = "panel";
    } else if (node.localName == "toolbar") {
      place = "toolbar";
    } else if (node.id == CustomizableUI.AREA_FIXED_OVERFLOW_PANEL) {
      place = "panel";
    } else if (node.id == "customization-palette") {
      place = "palette";
    }

    node = node.parentNode;
  }
  return place;
}
