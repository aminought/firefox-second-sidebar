import { CustomizeMode } from "./overrides/CustomizeMode.sys.mjs";

export class CustomizeModePatcher {
  static patch() {
    ChromeUtils.defineLazyGetter(window, "gCustomizeMode", () => {
      return new CustomizeMode(window);
    });
  }
}
