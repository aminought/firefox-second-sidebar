export const SIDEBAR_MAIN_CSS = `
  #sb2-main {
    display: flex;
    flex-direction: column;
    justify-content: var(--sb2-main-web-panel-buttons-position);
    gap: var(--space-small);
    padding: 0 0 0 4px;
    overflow-y: scroll;
    scrollbar-width: none;
    width: 0px;
    transition: width 0.5s ease-in-out, padding 0.5s ease-in-out;
    transition-delay: 0.5s !important;

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

    * {
      margin-right: -15px;
      transition: margin-right 0.5s ease-in-out;
      transition-delay: 0.5s !important;
    }
  }


  #sb2-main:hover, #sb2-main:active, #sb2-main:focus-within {
    width: 48px;
    padding: 0 var(--sb2-main-padding) var(--space-small) var(--sb2-main-padding);
    transition: width 0.5s ease-in-out, padding 0.5s ease-in-out;
    transition-delay: 0.5s !important;

    * {
      margin-right: 0px;
      transition: margin-right 0.5s ease-in-out;
    }
  }

  :root[customizing] {
    #sb2-main {
      min-width: unset !important;
      max-width: unset !important;
      width: unset !important;
      padding: 0 var(--sb2-main-padding) var(--space-small) var(--sb2-main-padding);
      * {
        margin-right: 0px;
      }
    }
  }

  #browser:has(#sb2-box:not([hidden])), 
  #browser:has(#sb2-main toolbarbutton[open]),
  #main-window:has(#sb2-main-menupopup[hasbeenopened]:hover) {
    #sb2-main {
      min-width: unset !important;
      max-width: unset !important;
      width: unset !important;
      padding: 0 var(--sb2-main-padding) var(--space-small) var(--sb2-main-padding);
      transition: width 0.5s ease-in-out, padding 0.5s ease-in-out;
      transition-delay: 0.5s !important;

      * {
        margin-right: 0px;
      }
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
