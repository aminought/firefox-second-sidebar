import { Toolbar } from "./base/toolbar.mjs";

export class SidebarMain extends Toolbar {
  constructor() {
    super({ id: "sb2-main", classList: ["browser-toolbar"] });
    this.setMode("icons")
      .setContext("sb2-main-menupopup")
      .setAttribute("customizable", "true")
      .setAttribute("fullscreentoolbar", "true")
      .addEventListener("popupshowing", onPopupShowing)
      .addEventListener("command", onCommand)
      .addEventListener("mousedown", onMouseDown)
      .addEventListener("mouseup", onMouseUp)
      .addEventListener("click", onClick);
  }
}

// https://searchfox.org/mozilla-central/source/browser/base/content/navigator-toolbox.js#14
/**
 *
 * @param {MouseEvent} event
 */
function onPopupShowing(event) {
  switch (event.target.id) {
    case "PlacesChevronPopup":
      document
        .getElementById("PlacesToolbar")
        ._placesView._onChevronPopupShowing(event);
      break;

    case "BMB_bookmarksPopup":
      BookmarkingUI.onPopupShowing(event);
    // fall through
    case "BMB_bookmarksToolbarPopup":
    case "BMB_unsortedBookmarksPopup":
    case "BMB_mobileBookmarksPopup":
      if (!event.target.parentNode._placesView) {
        let placeMap = {
          BMB_bookmarksPopup: PlacesUtils.bookmarks.menuGuid,
          BMB_bookmarksToolbarPopup: PlacesUtils.bookmarks.toolbarGuid,
          BMB_unsortedBookmarksPopup: PlacesUtils.bookmarks.unfiledGuid,
          BMB_mobileBookmarksPopup: PlacesUtils.bookmarks.mobileGuid,
        };
        new PlacesMenu(event, `place:parent=${placeMap[event.target.id]}`);
      }
      break;
  }
}

// https://searchfox.org/mozilla-central/source/browser/base/content/navigator-toolbox.js#43
/**
 *
 * @param {MouseEvent} event
 */
function onCommand(event) {
  let element = event.target.closest(`
        #firefox-view-button,
        #content-analysis-indicator,
        #bookmarks-toolbar-button,
        #PlacesToolbar,
        #import-button,
        #bookmarks-menu-button,
        #BMB_bookmarksPopup,
        #BMB_viewBookmarksSidebar,
        #BMB_searchBookmarks,
        #BMB_viewBookmarksToolbar`);
  if (!element) {
    return;
  }

  switch (element.id) {
    case "firefox-view-button":
      FirefoxViewHandler.openTab();
      break;

    case "content-analysis-indicator":
      ContentAnalysis.showPanel(element, PanelUI);
      break;

    case "bookmarks-toolbar-button":
      PlacesToolbarHelper.onPlaceholderCommand();
      break;

    case "PlacesToolbar":
    case "BMB_bookmarksPopup":
      BookmarksEventHandler.onCommand(event);
      break;

    case "import-button":
      MigrationUtils.showMigrationWizard(window, {
        entrypoint: MigrationUtils.MIGRATION_ENTRYPOINTS.BOOKMARKS_TOOLBAR,
      });
      break;

    case "bookmarks-menu-button":
      BookmarkingUI.onCommand(event);
      break;

    case "BMB_viewBookmarksSidebar":
      SidebarController.toggle("viewBookmarksSidebar");
      break;

    case "BMB_searchBookmarks":
      PlacesCommandHook.searchBookmarks();
      break;

    case "BMB_viewBookmarksToolbar":
      BookmarkingUI.toggleBookmarksToolbar("bookmarks-widget");
      break;

    default:
      throw new Error(`Missing case for #${element.id}`);
  }
}

// https://searchfox.org/mozilla-central/source/browser/base/content/navigator-toolbox.js#106
/**
 *
 * @param {MouseEvent} event
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

// https://searchfox.org/mozilla-central/source/browser/base/content/navigator-toolbox.js#156
/**
 *
 * @param {MouseEvent} event
 */
function onMouseUp(event) {
  let element = event.target.closest(`
        #PlacesToolbar,
        #BMB_bookmarksPopup
        `);
  if (!element) {
    return;
  }

  switch (element.id) {
    case "PlacesToolbar":
    case "BMB_bookmarksPopup":
      BookmarksEventHandler.onMouseUp(event);
      break;

    default:
      throw new Error(`Missing case for #${element.id}`);
  }
}

// https://searchfox.org/mozilla-central/source/browser/base/content/navigator-toolbox.js#178
/**
 *
 * @param {MouseEvent} event
 */
function onClick(event) {
  const isLeftClick = event.button === 0;

  let element = event.target.closest(`
        #vertical-tabs-newtab-button,
        #tabs-newtab-button,
        #new-tab-button,
        #back-button,
        #forward-button,
        #reload-button ,
        #urlbar-go-button,
        #reader-mode-button,
        #picture-in-picture-button,
        #shopping-sidebar-button,
        #urlbar-zoom-button,
        #star-button-box,
        #personal-toolbar-empty-description,
        #home-button,
        #PlacesToolbar,
        #BMB_bookmarksPopup,
        #tracking-protection-icon-container,
        #identity-icon-box,
        #identity-permission-box,
        #translations-button
        `);
  if (!element) {
    return;
  }

  switch (element.id) {
    case "vertical-tabs-newtab-button":
    case "tabs-newtab-button":
    case "new-tab-button":
      gBrowser.handleNewTabMiddleClick(element, event);
      break;

    case "back-button":
    case "forward-button":
    case "reload-button":
      checkForMiddleClick(element, event);
      break;

    case "urlbar-go-button":
      gURLBar.handleCommand(event);
      break;

    case "reader-mode-button":
      if (isLeftClick) {
        AboutReaderParent.toggleReaderMode(event);
      }
      break;

    case "picture-in-picture-button":
      if (isLeftClick) {
        PictureInPicture.toggleUrlbar(event);
      }
      break;

    case "shopping-sidebar-button":
      if (isLeftClick) {
        ShoppingSidebarParent.urlbarButtonClick(event);
      }
      break;

    case "urlbar-zoom-button":
      if (isLeftClick) {
        FullZoom.resetFromURLBar();
      }
      break;

    case "star-button-box":
      BrowserPageActions.doCommandForAction(
        PageActions.actionForID("bookmark"),
        event,
        element,
      );
      break;

    case "personal-toolbar-empty-description":
      if (isLeftClick && event.target.localName == "a") {
        PlacesCommandHook.showPlacesOrganizer("BookmarksToolbar");
      }
      break;

    case "home-button":
      BrowserCommands.home(event);
      break;

    case "PlacesToolbar":
      BookmarksEventHandler.onClick(event, element._placesView);
      break;

    case "BMB_bookmarksPopup":
      BookmarksEventHandler.onClick(event, element.parentNode._placesView);
      break;

    case "tracking-protection-icon-container":
      gProtectionsHandler.handleProtectionsButtonEvent(event);
      break;

    case "identity-icon-box":
      gIdentityHandler.handleIdentityButtonEvent(event);
      PageProxyClickHandler(event);
      break;

    case "identity-permission-box":
      gPermissionPanel.handleIdentityButtonEvent(event);
      PageProxyClickHandler(event);
      break;

    case "translations-button":
      FullPageTranslationsPanel.open(event);
      break;

    default:
      throw new Error(`Missing case for #${element.id}`);
  }
}
