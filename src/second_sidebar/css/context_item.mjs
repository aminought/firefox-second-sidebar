import { L } from "../i18n/index.mjs";

export const CONTEXT_ITEM_CSS = `
  #contentAreaContextMenu:has(#context-openlink[hidden="true"]) {
    #context-openlinkaswebpanel, #context-openlinkastempwebpanel, #context-sep-open {
      display: none;
    }
  }

  menuitem[label="${L.contextMenu.resetZoom}"] {
    display: none;
  }
`;
