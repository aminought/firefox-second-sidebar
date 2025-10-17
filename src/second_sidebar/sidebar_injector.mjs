import { SidebarControllers } from "./sidebar_controllers.mjs";
import { SidebarElements } from "./sidebar_elements.mjs";
import { SidebarSettings } from "./settings/sidebar_settings.mjs";
import { WebPanelsSettings } from "./settings/web_panels_settings.mjs";
import { WebPanelsState } from "./settings/web_panels_state.mjs";
import { isPopupWindow } from "./utils/windows.mjs";

export class SidebarInjector {
  /**
   *
   * @returns {boolean}
   */
  static inject() {
    if (isPopupWindow()) {
      console.log("Failed to load second sidebar because window is popup");
      return false;
    }

    console.log("Loading sidebar settings...");
    const sidebarSettings = SidebarSettings.load();

    console.log("Loading web panel settings...");
    const webPanelsSettings = WebPanelsSettings.load(
      sidebarSettings.position,
      sidebarSettings.defaultFloatingOffset,
    );

    console.log("Loading web panel state...");
    const webPanelsState = WebPanelsState.load();

    console.log("Elements creation...");
    SidebarElements.create();

    console.log("Building controllers...");
    SidebarControllers.create();

    console.log("Applying settings...");
    SidebarControllers.sidebarController.loadSettings(sidebarSettings);
    SidebarControllers.webPanelsController.loadSettingsAndState(
      webPanelsSettings,
      webPanelsState,
    );

    console.log("Second Sidebar loaded");
    return true;
  }
}
