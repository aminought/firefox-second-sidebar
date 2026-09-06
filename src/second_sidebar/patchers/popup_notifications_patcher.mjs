import { removeFile, writeFile } from "../utils/files.mjs";

const MODULE_URL = "resource://gre/modules/PopupNotifications.sys.mjs";
const PATCHED_MODULE_RELATIVE_PATH = "fss/PopupNotifications.sys.mjs";

export class PopupNotificationsPatcher {
  /**
   * @param {Window} childWindow
   */
  static patch(childWindow) {
    console.log("Patching PopupNotifications.sys.mjs...");
    fetch(MODULE_URL)
      .then(async (response) => {
        let moduleSource = await response.text();
        moduleSource = this.#patchModuleSource(moduleSource);
        await this.#replaceModule(moduleSource, childWindow);
      })
      .catch(console.error);
    console.log("PopupNotifications.sys.mjs was patched");
  }

  static #patchModuleSource(moduleSource) {
    // The nested panel window cannot be the active top-level window. Check
    // and focus its owner while preserving Firefox's early return and delay.
    return moduleSource
      .replace(/(let isActiveBrowser = ).+/gm, "$1true;")
      .replace(/(let isActiveWindow = ).+/gm, "$1true;")
      .replace(/(Services\.focus\.activeWindow != this\.window)\b/g, "$1.top")
      .replace(/this\.window\.focus\(\)/g, "this.window.top.focus()");
  }

  static async #replaceModule(moduleSource, childWindow) {
    const chromePath = await writeFile(
      PATCHED_MODULE_RELATIVE_PATH,
      moduleSource,
    );
    const module = await import(chromePath);
    this.#defineLazyGetter(module, childWindow);
    await removeFile(PATCHED_MODULE_RELATIVE_PATH);
  }

  /**
   * @param {Object} module
   * @param {Window} childWindow
   */
  static #defineLazyGetter(module, childWindow) {
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
