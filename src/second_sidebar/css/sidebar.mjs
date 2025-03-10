export const SIDEBAR_CSS = `
  #sb2 {
    border-radius: var(--border-radius-medium);
    box-shadow: var(--content-area-shadow);
    border: 0.5px solid var(--sidebar-border-color);
    overflow: hidden;
    height: 100%;
    pointer-events: auto;
    min-width: 200px;

    #sb2-toolbar {
      flex-direction: row;
      min-height: unset;
      gap: 4px;
      background-color: var(--toolbar-bgcolor);
      color: var(--toolbar-color);
      padding: 1px;

      #sb2-toolbar-title-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        overflow: hidden;
      }

      #sb2-toolbar-title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin: 0;
      }
    }

    #sb2-web-panels {
      width: 100%;
      height: 100%;
      order: 0;
    }
  }
  
  #sb2[pinned="true"] {
    width: 100% !important;
  }
`;
