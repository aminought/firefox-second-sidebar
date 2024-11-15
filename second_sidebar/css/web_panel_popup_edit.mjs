export const WEB_PANEL_POPUP_EDIT_CSS = `
  #sidebar-2-web-panel-popup-edit {
    width: 400px;
  }

  #sidebar-2-web-panel-popup-edit-favicon-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--space-small);
    width: 100%;
  }

  #sidebar-2-web-panel-favicon-input {
    background-size: 22px;
    padding-right: 30px;
    background-position-x: calc(100% - var(--space-small));
    background-position-y: center;
    background-repeat: no-repeat;
  }

  #sidebar-2-web-panel-popup-edit-multiview-buttons-row {
    justify-content: space-between;
    width: 100%;
    margin-top: var(--space-large);
  }

  #sidebar-2-web-panel-popup-edit-move-buttons .toolbarbutton-text {
    display: none;
  }
`;
