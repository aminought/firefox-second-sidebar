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
    }

    .toolbarbutton-1 {
      padding: 0 !important;
    }
  }

  :root[customizing] {
    #sb2-main {
      min-width: unset !important;
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
      width: var(--sb2-main-button-icon-overlay-size) !important;
      height: var(--sb2-main-button-icon-overlay-size) !important;
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
`;
