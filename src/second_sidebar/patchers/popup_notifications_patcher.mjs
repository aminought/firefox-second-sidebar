import { removeFile, writeFile } from "../utils/files.mjs";

const MODULE_URL = "resource://gre/modules/PopupNotifications.sys.mjs";
const PATCHED_MODULE_RELATIVE_PATH = "fss/PopupNotifications.sys.mjs";

export class PopupNotificationsPatcher {
  static patch() {
    console.log("Patching PopupNotifications.sys.mjs...");
    fetch(MODULE_URL)
      .then(async (response) => {
        let moduleSource = await response.text();
        moduleSource = this.#patchModuleSource(moduleSource);
        await this.#replaceModule(moduleSource);
      })
      .catch(console.error);
    console.log("PopupNotifications.sys.mjs was patched");
  }

  static #patchModuleSource(moduleSource) {
    return moduleSource
      .replace(/(let isActiveBrowser = ).+/gm, "$1true;")
      .replace(/(let isActiveWindow = ).+/gm, "$1true;")
      .replace(/(this\.window\.focus\(\);)\s+return;/gm, "$1");
  }

  static async #replaceModule(moduleSource) {
    const chromePath = await writeFile(
      PATCHED_MODULE_RELATIVE_PATH,
      moduleSource,
    );
    const module = await import(chromePath);
    this.#defineLazyGetter(module);
    await removeFile(PATCHED_MODULE_RELATIVE_PATH);
  }

  /**
   * @param {Object} module
   */
  static #defineLazyGetter(module) {
    const childWindow = window[1];
    ChromeUtils.defineLazyGetter(childWindow, "PopupNotifications", () => {
      try {
        let shouldSuppress = () => {
          return false;
        };
        const getVisibleAnchorElement = () => {
          return childWindow.document.getElementById("mainPopupSet");
        };
        return new module.PopupNotifications(
          childWindow.gBrowser,
          childWindow.document.getElementById("notification-popup"),
          childWindow.document.getElementById("notification-popup-box"),
          { shouldSuppress, getVisibleAnchorElement },
        );
      } catch (ex) {
        console.error(ex);
        return null;
      }
    });
  }
}
