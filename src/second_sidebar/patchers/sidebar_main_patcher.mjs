import { removeFile, writeFile } from "../utils/files.mjs";

import { SidebarElements } from "../sidebar_elements.mjs";

const MODULE_URL = "chrome://browser/content/navigator-toolbox.js";
const PATCHED_MODULE_RELATIVE_PATH = "fss/navigator-toolbox.mjs";

export class SidebarMainPatcher {
  static patch() {
    console.log("Patching #sb2-main...");
    fetch(MODULE_URL)
      .then(async (response) => {
        let moduleSource = await response.text();
        moduleSource = this.#patchModuleSource(moduleSource);
        await this.#reuseModule(moduleSource);
      })
      .catch(console.error);
    console.log("#sb2-main was patched");
  }

  /**
   * @param {string} moduleSource
   * @returns {string}
   */
  static #patchModuleSource(moduleSource) {
    const matches = moduleSource.matchAll(/\s{4}function.*?^\s{4}}/gms);
    return Array.from(matches)
      .map((match) => match[0].replace(/\s{4}function/gm, "export function"))
      .join("\n");
  }

  static async #reuseModule(moduleSource) {
    const chromePath = await writeFile(
      PATCHED_MODULE_RELATIVE_PATH,
      moduleSource,
    );
    const module = await import(chromePath);
    this.#addListeners(module);
    await removeFile(PATCHED_MODULE_RELATIVE_PATH);
  }

  /**
   * @param {object} module
   */
  static #addListeners(module) {
    for (const [funcName, func] of Object.entries(module)) {
      const eventName = funcName.toLowerCase().replace(/^on/, "");
      SidebarElements.sidebarMain.addEventListener(eventName, func);
    }
  }
}
