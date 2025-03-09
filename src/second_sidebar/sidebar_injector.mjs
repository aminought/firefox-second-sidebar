import { PreferencesWrapper } from "./wrappers/preferences.mjs";
import { SidebarControllers } from "./sidebar_controllers.mjs";
import { SidebarElements } from "./sidebar_elements.mjs";
import { SidebarSettings } from "./settings/sidebar_settings.mjs";
import { WebPanelsSettings } from "./settings/web_panels_settings.mjs";
import { isPopupWindow } from "./utils/windows.mjs";

export class SidebarInjector {
  /**
   *
   * @returns {boolean}
   */
  static inject() {
    console.log("Loading sidebar settings...");
    const sidebarSettings = SidebarSettings.load();

    if (isPopupWindow() && sidebarSettings.hideInPopupWindows) {
      console.log("Failed to load second sidebar because window is popup");
      return false;
    }

    console.log("Allowing scripts to close windows...");
    PreferencesWrapper.setBoolPref("dom.allow_scripts_to_close_windows", true);

    console.log("Loading web panel settings...");
    const webPanelsSettings = WebPanelsSettings.load();

    console.log("Elements creation...");
    SidebarElements.create();

    console.log("Building controllers...");
    SidebarControllers.create();

    console.log("Applying settings...");
    SidebarControllers.sidebarController.loadSettings(sidebarSettings);
    SidebarControllers.webPanelsController.loadSettings(webPanelsSettings);

    console.log("Second Sidebar loaded");
    return true;
  }
}
