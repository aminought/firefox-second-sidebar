import { Toolbar } from "./base/toolbar.mjs";

export class SidebarMain extends Toolbar {
  constructor() {
    super({ id: "sb2-main", classList: ["browser-toolbar"] });
    this.setMode("icons")
      .setContext("sb2-main-menupopup")
      .setAttribute("customizable", "true")
      .addEventListener("click", onMouseDown);
  }
}

// https://searchfox.org/mozilla-central/source/browser/base/content/navigator-toolbox.js#106
/**
 *
 * @param {MouseEvent} event
 * @returns
 */
function onMouseDown(event) {
  let element = event.target.closest(`
        #firefox-view-button,
        #alltabs-button,
        #pageActionButton,
        #downloads-button,
        #fxa-toolbar-menu-button,
        #unified-extensions-button,
        #library-button
        `);
  if (!element) {
    return;
  }

  switch (element.id) {
    case "firefox-view-button":
      FirefoxViewHandler.openToolbarMouseEvent(event);
      break;

    case "alltabs-button":
      gTabsPanel.showAllTabsPanel(event, "alltabs-button");
      break;

    case "pageActionButton":
      BrowserPageActions.mainButtonClicked(event);
      break;

    case "downloads-button":
      DownloadsIndicatorView.onCommand(event);
      break;

    case "fxa-toolbar-menu-button":
      gSync.toggleAccountPanel(element, event);
      break;

    case "unified-extensions-button":
      gUnifiedExtensions.togglePanel(event);
      break;

    case "library-button":
      PanelUI.showSubView("appMenu-libraryView", element, event);
      break;

    default:
      throw new Error(`Missing case for #${element.id}`);
  }
}
