import { removeFile, writeFile } from "../utils/files.mjs";

const MODULE_URLS = [
  "resource:///modules/CustomizeMode.sys.mjs",
  "moz-src:///browser/components/customizableui/CustomizeMode.sys.mjs",
];
const PATCHED_MODULE_RELATIVE_PATH = "fss/CustomizeMode.sys.mjs";

export class CustomizeModePatcher {
  static patch() {
    console.log("Patching CustomizeMode.sys.mjs...");
    for (const moduleUrl of MODULE_URLS) {
      fetch(moduleUrl)
        .then(async (response) => {
          let moduleSource = await response.text();
          moduleSource = this.#patchModuleSource(moduleSource);
          await this.#replaceModule(moduleSource);
        })
        .catch(console.error);
    }
    console.log("CustomizeMode.sys.mjs was patched");
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
    const chromePath = await writeFile(
      PATCHED_MODULE_RELATIVE_PATH,
      moduleText,
    );
    const module = await import(chromePath);
    this.#defineLazyGetter(module);
    removeFile(PATCHED_MODULE_RELATIVE_PATH);
  }

  /**
   *
   * @param {Object} module
   */
  static #defineLazyGetter(module) {
    ChromeUtils.defineLazyGetter(window, "gCustomizeMode", () => {
      return new module.CustomizeMode(window);
    });
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
