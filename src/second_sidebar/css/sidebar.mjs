export const SIDEBAR_CSS = `
  #sidebar-2 {
    box-shadow: var(--content-area-shadow);
    border-radius: var(--border-radius-medium);
    overflow: hidden;
    height: 100%;
    pointer-events: auto;
    min-width: 200px;
    outline: 0.01px solid var(--chrome-content-separator-color);

    #sidebar-2-toolbar {
      display: flex;
      flex-direction: row;
      min-height: unset;
      gap: 4px;
      background-color: var(--toolbar-bgcolor);
      color: var(--toolbar-color);

      #sidebar-2-toolbar-title-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        overflow: hidden;
      }

      #sidebar-2-toolbar-title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin: 0;
      }

      #sidebar-2-pin-button {
        transform: scale(-1, 1);
      }
    }

    #sidebar-2-web-panels {
      width: 100%;
      height: 100%;
    }
  }
  
  #sidebar-2[pinned="true"] {
    width: 100% !important;
  }
`;
