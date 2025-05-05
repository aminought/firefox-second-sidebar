export const SIDEBAR_CSS = `
  #sb2 {
    border-radius: var(--zen-native-inner-radius);
    box-shadow: var(--zen-big-shadow);
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

      #sb2-toolbar-nav-buttons {
        color-scheme: dark;
      }

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
  
  #sb2[type="split"] {
    width: 100% !important;
  }
`;
