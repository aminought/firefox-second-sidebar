export class UrlbarInputPatcher {
  static patch() {
    console.log("Patching #urlbar-input...");
    this.#defineLazyGetter();
    console.log("#urlbar-input was patched");
  }

  static #defineLazyGetter() {
    const childWindow = window[1];
    const urlbarInput = childWindow.document.querySelector("#urlbar-input");
    ChromeUtils.defineLazyGetter(urlbarInput, "editor", () => null);
  }
}
