export const POPUPS_CSS = `
  .sb2-popup {
    panelmultiview {
      display: flex;
      flex-direction: column;
      align-items: unset;
      width: 100%;
      padding: var(--space-xsmall) 0;

      .panel-header {
        align-self: center;
      }

      toolbarseparator, input {
        width: -moz-available;
      }

      .sb2-popup-group {
        justify-content: space-between;
        align-items: center;
        width: 100%;
        min-height: 33px;
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
  }

  .sb2-popup-with-header {
    panelmultiview {
      padding: 0 var(--space-small) var(--space-small) var(--space-small);
    }
  }

  #sb2-main-popup-settings,
  #sb2-web-panel-edit {
    width: 400px;
  }

  #sb2-web-panel-new,
  #sb2-web-panel-delete {
    width: 300px;
  }

  #sb2-web-panel-new-buttons,
  #sb2-web-panel-delete-buttons {
    justify-content: end;
    width: 100%;
    margin-top: var(--space-small);
  }

  #sb2-main-popup-settings-buttons {
    justify-content: end;
    width: 100%;
    margin-top: var(--space-small);
  }

  #sb2-web-panel-edit-favicon-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--space-small);
    width: 100%;
  }

  #sb2-web-panel-edit-multiview-buttons-row {
    justify-content: space-between;
    width: 100%;
    margin-top: var(--space-large);
  }

  #sb2-zoom-buttons {
    justify-content: center;
  }

  #sb2-zoom-button > .toolbarbutton-text {
    min-width: calc(4ch + 8px);
    text-align: center;
  }
`;
