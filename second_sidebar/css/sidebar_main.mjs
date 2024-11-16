export const SIDEBAR_MAIN_CSS = `
  #sidebar-2-main {
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: scroll;
    padding: 0 var(--space-small) 0 var(--space-small);
  }

  #browser:has(#sidebar-2[position="right"]) #sidebar-2-main {
    order: 7 !important;
  }

  #browser:has(#sidebar-2[position="left"]) #sidebar-2-main {
    order: -3 !important;
  }

  #sidebar-2-main-web-panel-buttons {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  #sidebar-2-main-web-panel-buttons:empty {
    display: none;
  }

  .sidebar-2-main-button {
    position: relative;

    .toolbarbutton-icon {
      width: var(--sidebar-2-main-button-icon-size) !important;
      height: var(--sidebar-2-main-button-icon-size) !important;
    }

    .tab-icon-overlay {
      position: absolute !important;
      width: var(--sidebar-2-main-button-icon-overlay-size) !important;
      height: var(--sidebar-2-main-button-icon-overlay-size) !important;
      padding: 0px !important;
      margin: 0px !important;
      top: 0 !important;
      right: 0 !important;
    }

    .tab-icon-overlay[hidden="true"] {
      display: none !important;
    }
  }

  .sidebar-2-main-button[unloaded="true"] {
    .toolbarbutton-icon {
      opacity: var(--toolbarbutton-disabled-opacity);
    }
  }
`;
