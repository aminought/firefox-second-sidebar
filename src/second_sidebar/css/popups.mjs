export const POPUPS_CSS = `
  .sb2-popup > panelmultiview {
    display: flex;
    flex-direction: column;
    align-items: unset;
    width: 100%;

    .panel-header {
      align-self: center;
    }

    toolbarseparator {
      width: 100%;
      align-self: center;
    }
    
    input {
      width: -moz-available;
      box-sizing: border-box;
      height: 32px;
    }

    .sb2-button-iconic .toolbarbutton-text {
      display: none;
    }

    .subviewbutton[type="checkbox"]:not([checked="true"]) {
      list-style-image: url(chrome://global/skin/icons/close.svg);
      -moz-context-properties: fill;
      fill: currentColor;
      color: inherit;

      .toolbarbutton-text {
        padding-inline-start: 8px;
      }
    }
  }

  #sb2-main-popup-settings,
  #sb2-web-panel-new,
  #sb2-web-panel-edit {
    width: 400px;
  }

  #sb2-web-panel-delete {
    width: 300px;
  }

  .sb2-popup-header, .sb2-popup-body, .sb2-popup-footer {
    width: 100%;
  }

  .sb2-popup-header {
    align-self: center;
    padding: 0 var(--space-xsmall);

    h1 {
      align-self: center;
    }
  }

  .sb2-popup-body {
    overflow-y: scroll;
    padding: 0 var(--space-medium);

    .subviewbutton {
      margin: unset;
      padding: var(--space-small) var(--space-medium);
    }

    label {
      text-wrap: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .sb2-popup-body.compact {
    padding: 0;
    gap: 0;
  }

  .sb2-popup-footer {
    justify-content: end;
    margin-top: var(--space-small);
  }

  .sb2-popup-group {
    justify-content: space-between;
    align-items: center;
    width: 100%;
    min-height: 24px;
    max-height: 24px;

    h1 {
      text-wrap: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .sb2-popup-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--space-xsmall);
    width: 100%;
  }

  .sb2-popup-set {
    display: flex;
  }

  .sb2-popup-set-header {
    display: flex;
  }

  .sb2-popup-set-body {
    display: flex;
    background-color: var(--arrowpanel-dimmed);
    border-radius: var(--border-radius-medium);
    padding: var(--space-small);
    gap: 1px;
  }

  #sb2-zoom-buttons {
    justify-content: center;

    #sb2-zoom-button > .toolbarbutton-text {
      min-width: calc(4ch + 8px);
      text-align: center;
    }
  }

  .sb2-popup-body:has(#sb2-popup-css-selector-toggle:not([pressed])) {
    #sb2-popup-css-selector-sep,
    #sb2-popup-css-selector-input {
      display: none;
    }
  }

  .sb2-popup-menu-list {
    margin-top: 0px;
    margin-bottom: 0px;
    line-height: 16px;
  }
`;
