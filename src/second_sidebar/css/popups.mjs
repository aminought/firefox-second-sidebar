export const POPUPS_CSS = `
  .sb2-popup > panelmultiview {
    display: flex;
    flex-direction: column;
    align-items: unset;
    width: 100%;

    .sb2-popup-header {
      margin-bottom: var(--space-small);
      padding: 0 var(--space-xsmall);

      h1 {
        align-self: center;
        margin: 0;
        padding: var(--space-small);
      }
    }

    .sb2-popup-body {
      padding: 0 var(--space-medium);
      width: 100%;
      overflow-y: scroll;
      gap: var(--space-small);

      .subviewbutton {
        margin: unset;
        padding: var(--space-small) var(--space-medium);
      }

      .sb2-popup-set {
        display: flex;

        .sb2-popup-set-header {
          display: flex;
          margin-block: 0;
          margin-bottom: var(--space-small);
        }

        .sb2-popup-set-body {
          display: flex;
          background-color: var(--toolbar-bgcolor, var(--toolbar-background-color));
          color: var(--toolbar-color, var(--toolbar-text-color));
          border: solid 1px var(--border-color-deemphasized);
          border-radius: var(--border-radius-medium);
          padding: var(--space-small);
          gap: 1px;

          .sb2-popup-group {
            justify-content: space-between;
            align-items: center;
            width: 100%;
            min-height: 24px;
          }

          .sb2-popup-row {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: var(--space-xsmall);
            width: 100%;
            min-height: 24px;
          }

          label {
            font-weight: 500;
            text-wrap: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }

      .sb2-popup-set.sb2-popup-warning {
        .sb2-popup-set-body {
          background-color: var(--background-color-warning);
        }
      }
    }

    .sb2-popup-body.compact {
      padding: 0;
      gap: 0;

      .sb2-popup-set-body {
        padding: 0;
      }

      #sb2-zoom-buttons {
        margin: var(--space-xsmall);
      }

      menuseparator {
        padding-block: 0;
      }

      label.toolbarbutton-text {
        font-weight: normal;
      }
    }

    .sb2-popup-footer {
      justify-content: end;
      margin-top: var(--space-small);
      gap: var(--space-small);
      padding: var(--space-xsmall);
      width: 100%;
    }

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
      background-color: var(--toolbar-field-background-color);
      color: var(--toolbar-field-color, var(--toolbar-field-text-color));
      border: solid 1px var(--toolbar-field-border-color);
      outline: unset;

      &[error="true"] {
        background-color: var(--background-color-critical) !important;
      }
    }

    input:focus-visible {
      background-color: var(
        --toolbar-field-background-color-focus,
        var(--toolbar-field-focus-background-color, var(--toolbar-field-background-color))
      );
      color: var(
        --toolbar-field-text-color-focus,
        var(--toolbar-field-focus-color, var(--toolbar-field-color, var(--toolbar-field-text-color)))
      );
      border: solid 1px
        var(
          --toolbar-field-border-color-focus,
          var(--toolbar-field-focus-border-color, var(--toolbar-field-border-color))
        );
    }

    .sb2-button-iconic .toolbarbutton-text {
      display: none;
    }

    .sb2-popup-menu-list {
      margin-top: 0px;
      margin-bottom: 0px;
    }
  }

  #sb2-main-popup-settings-backdrop,
  #sb2-web-panel-edit-backdrop {
    position: fixed;
    inset: 0;
    z-index: 2147483646;
    background: transparent;

    &[hidden] {
      display: none;
    }
  }

  .sb2-popup > panelmultiview:has(> .sb2-popup-discard-confirmation) {
    position: relative;
    overflow: hidden;

    > .sb2-popup-discard-confirmation {
      position: absolute;
      inset: 0;
      z-index: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: stretch;
      box-sizing: border-box;
      padding: var(--space-medium);
      background-color: rgb(0 0 0 / 42%);

      &[hidden] {
        display: none;
      }

      .sb2-popup-discard-confirmation-card {
        display: flex;
        flex-direction: column;
        padding: var(--space-medium);
        gap: var(--space-small);
        color: var(--arrowpanel-color, CanvasText);
        background-color: var(--arrowpanel-background, Canvas);
        border: solid 1px
          var(--arrowpanel-border-color, var(--border-color-deemphasized));
        border-radius: var(--border-radius-medium);
        box-shadow: 0 8px 24px rgb(0 0 0 / 35%);
      }

      .sb2-popup-discard-confirmation-title {
        display: flex;
        align-items: center;
        gap: var(--space-xsmall);
      }

      .sb2-popup-discard-confirmation-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: none;
        box-sizing: border-box;
        margin: 0;
        width: 18px;
        height: 18px;
        color: var(--text-color-deemphasized);
        border: solid 1px currentColor;
        border-radius: 50%;
        font-weight: bold;
      }

      .sb2-popup-discard-confirmation-heading {
        margin: 0;
        font-weight: 600;
      }

      .sb2-popup-discard-confirmation-description {
        margin: 0 0 0 calc(18px + var(--space-xsmall));
        color: var(--text-color-deemphasized);
        text-wrap: wrap;
      }

      .sb2-popup-discard-confirmation-card > .sb2-popup-footer {
        margin: 0;
        padding: 0;
      }
    }
  }

  .sb2-tooltip {
    width: 300px;

    .sb2-tooltip-container {
      display: flex;
      flex-direction: column;
      padding: var(--space-small);
    }
  }

  #sb2-web-panel-tooltip {
    #sb2-web-panel-tooltip-title {
      overflow: hidden;
      font-weight: bold;
      -webkit-line-clamp: 2;
    }

    #sb2-web-panel-tooltip-url {
      color: var(--text-color-deemphasized);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  #sb2-main-popup-settings,
  #sb2-web-panel-new,
  #sb2-web-panel-edit {
    width: 400px;
  }

  #sb2-web-panel-delete {
    width: 300px;

    label {
      text-wrap: wrap;
    }
  }

  #sb2-zoom-buttons {
    justify-content: center;

    #sb2-zoom-button > .toolbarbutton-text {
      min-width: calc(4ch + 8px);
      text-align: center;
    }
  }

  .sb2-popup-body:has(#sb2-popup-dynamic-title-toggle[pressed]) {
    #sb2-popup-title-items {
      display: none;
    }
  }

  .sb2-popup-body:has(#sb2-popup-dynamic-favicon-toggle[pressed]) {
    #sb2-popup-favicon-items {
      display: none;
    }
  }

  .sb2-popup-body:has(#sb2-popup-css-selector-toggle:not([pressed])) {
    #sb2-popup-css-selector-items {
      display: none;
    }
  }

  .sb2-popup-body:has(#sb2-popup-pin-type-menu-list[value="true"]) {
    #sb2-popup-floating-items {
      display: none;
    }
  }

  .sb2-popup-body:has(#sb2-popup-shortcut-toggle:not([pressed])) {
    #sb2-popup-shortcut-items {
      display: none;
    }
  }

  .sb2-popup:has(#sb2-main-popup-settings-tooltip-menu-list[value="off"]),
  .sb2-popup:has(#sb2-main-popup-settings-tooltip-menu-list[value="title"]) {
    #sb2-main-popup-settings-tooltip-items {
      display: none;
    }
  }

  .sb2-popup:has(#sb2-main-popup-settings-auto-hide-sidebar-toggle:not([pressed])) {
    #sb2-main-popup-settings-auto-hide-sidebar-items {
      display: none;
    }
  }

  .sb2-popup:has(#sb2-main-popup-settings-auto-hide-sidebar-toggle[pressed]) {
    #sb2-main-popup-settings-sidebar-widget-items {
      display: none;
    }
  }
`;
