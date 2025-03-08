export const POPUPS_CSS = `
  .sb2-popup > panelmultiview {
    display: flex;
    flex-direction: column;
    align-items: unset;
    gap: var(--space-medium);
    width: 100%;
    padding: var(--space-xsmall);

    .panel-header {
      align-self: center;
    }

    toolbarseparator, input {
      width: -moz-available;
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

    h1 {
      align-self: center;
    }
  }

  .sb2-popup-body {
    overflow-y: auto;
    padding: 0 var(--space-medium);
    gap: var(--space-xsmall);

    .subviewbutton {
      margin: unset;
      padding: var(--space-small) var(--space-medium);
    }
  }

  .sb2-popup-body.compact {
    padding: 0;
    gap: 0;
  }

  .sb2-popup-footer {
    justify-content: end;
  }

  .sb2-popup-group {
    justify-content: space-between;
    align-items: center;
    width: 100%;
    min-height: 33px;
  }

  .sb2-popup-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--space-small);
    width: 100%;
  }

  #sb2-zoom-buttons {
    justify-content: center;

    #sb2-zoom-button > .toolbarbutton-text {
      min-width: calc(4ch + 8px);
      text-align: center;
    }
  }
`;
