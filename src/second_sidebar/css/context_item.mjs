export const CONTEXT_ITEM_CSS = `
  #contentAreaContextMenu:has(#context-openlink[hidden="true"]) {
    #context-openlinkaswebpanel, #context-openlinkastempwebpanel, #context-sep-open {
      display: none;
    }
  }

  menuitem[label="Reset Zoom [100%]"] {
    display: none;
  }
`;
