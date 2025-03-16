export class CustomizeModePatcher {
  static patch() {
    fetch("resource:///modules/CustomizeMode.sys.mjs").then((response) => {
      response.text().then((moduleSource) => {
        moduleSource = this.#patchModuleSource(moduleSource);
        this.#replaceModule(moduleSource);
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
    const moduleBlob = new Blob([moduleText], {
      type: "application/javascript",
    });
    const moduleURL = URL.createObjectURL(moduleBlob);
    import(moduleURL).then((module) => {
      ChromeUtils.defineLazyGetter(window, "gCustomizeMode", () => {
        return new module.CustomizeMode(window);
      });
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
