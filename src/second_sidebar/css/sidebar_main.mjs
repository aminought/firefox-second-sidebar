export const SIDEBAR_MAIN_CSS = `
  #sb2-main {
    display: flex;
    flex-direction: column;
    justify-content: var(--sb2-main-web-panel-buttons-position);
    gap: var(--space-small);
    padding: 0 var(--sb2-main-padding) var(--space-small) var(--sb2-main-padding);
    overflow-y: scroll;
    scrollbar-width: none;

    toolbarpaletteitem[place="panel"][id^="wrapper-customizableui-special-spring"], toolbarspring {
      flex: 1;
      min-height: 10px;
      max-height: 112px;
      min-width: unset;
      max-width: unset;
    }

    .toolbaritem-combined-buttons {
      justify-content: center;
      margin-inline: 0;
    }

    .toolbarbutton-1 {
      padding: 0 !important;
    }
  }

  #sb2-main[fullscreenShouldAnimate] {
    transition: 0.8s margin-right ease-out, 0.8s margin-left ease-out;
  }

  #sb2-main[shouldAnimate] {
    transition: 0.2s margin-right ease-out, 0.2s margin-left ease-out;
  }

  #browser:has(#sb2-box:not([hidden])), 
  #browser:has(#sb2-main toolbarbutton[open]),
  #main-window:has(#sb2-main-popup-settings[panelopen]),
  #main-window:has(#sb2-main-menupopup[panelopen]),
  #main-window:has(#sb2-web-panel-button-menupopup[panelopen]) {
    #sb2-main {
      margin-left: 0px !important;
      margin-right: 0px !important;
    }
  }

  :root[customizing] {
    #sb2-main {
      min-width: unset !important;
      margin-left: 0px !important;
      margin-right: 0px !important;
    }
  }

  #browser:has(#sb2[position="right"]) #sb2-main {
    order: 7 !important;
  }

  #browser:has(#sb2[position="left"]) #sb2-main {
    order: -3 !important;
  }

  .sb2-main-button {
    position: relative;
    padding: 0;

    .tab-icon-overlay {
      position: absolute !important;
      padding: 0px !important;
      margin: 0px !important;
      top: 0 !important;
      right: 0 !important;
    }

    .tab-icon-overlay[hidden="true"] {
      display: none !important;
    }
  }

  .sb2-main-button[unloaded="true"] {
    .toolbarbutton-icon {
      opacity: var(--toolbarbutton-disabled-opacity);
    }
  }

  #widget-overflow-fixed-list .sb2-main-button {
    padding: var(--arrowpanel-menuitem-padding);
  }

  #sb2-collapse-button[position="left"] {
    list-style-image: url("chrome://userscripts/content/second_sidebar/icons/sidebar-left.svg");
  }

  #sb2-collapse-button[position="right"] {
    list-style-image: url("chrome://userscripts/content/second_sidebar/icons/sidebar-right.svg");
  }
`;
