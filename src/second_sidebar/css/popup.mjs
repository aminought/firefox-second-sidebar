export const POPUP_CSS = `
  .sidebar-2-popup {
    width: 300px;

    panelmultiview {
      display: flex;
      flex-direction: column;
      width: 100%;
      padding: 0 var(--space-small) var(--space-small) var(--space-small);

      .panel-header {
        align-self: center;
      }

      toolbarseparator, input {
        width: -moz-available;
      }

      .sidebar-2-popup-button.subviewbutton-iconic .toolbarbutton-text {
        display: none;
      }

      .sidebar-2-popup-group {
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }
    }
  }
`;
