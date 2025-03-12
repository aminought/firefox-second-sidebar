export const SIDEBAR_BOX_CSS = `
  #sb2-box {
    background-color: var(--toolbar-bgcolor);
    min-width: 200px;
    pointer-events: none;
    box-sizing: content-box;
  }

  #browser:has(#sb2[pinned="false"]) {
    #sb2-box {
      position: absolute;
      background-color: transparent;
      padding-block-start: var(--sb2-box-unpinned-top-padding);
      height: calc(100% - var(--sb2-box-unpinned-top-padding) - var(--sb2-box-unpinned-bottom-padding));
      width: 100% !important;
      z-index: 3;

      #sb2-box-filler {
        display: block;
        flex: 1;
        pointer-events: none;
      }

      #sb2-splitter-unpinned {
        pointer-events: auto;
        border: unset;
      }
    }
  }

  #browser:has(#sb2[pinned="true"][position="right"]) {
    #sb2-box {
      order: 16 !important;
      padding-inline-start: var(--space-small);
      padding-inline-end: 1px;
    }

    #sb2-splitter-pinned {
      order: 15 !important;
      margin-inline-start: unset;
      margin-inline-end: calc(-1 * var(--splitter-width));
    }
  }

  #browser:has(#sb2[pinned="true"][position="left"]) {
    #sb2-box {
      order: -2 !important;
      padding-inline-start: 1px;
      padding-inline-end: var(--space-small);
    }

    #sb2-splitter-pinned {
      order: -1 !important;
      margin-inline-start: calc(-1 * var(--splitter-width));
      margin-inline-end: unset;
    }
  }

  #browser:has(#sb2[pinned="false"][position="right"]) {
    #sb2-box-filler {
      order: 0;
    }

    #sb2-splitter-unpinned {
      order: 1;
      margin-inline-start: calc(-1 * var(--splitter-width));
      margin-inline-end: unset;
    }

    #sb2 {
      order: 2;
    }

    #sb2-box {
      padding-inline-end: var(--sb2-box-unpinned-side-padding);
    }
  }

  #browser:has(#sb2[pinned="false"][position="left"]) {
    #sb2-box-filler {
      order: 2;
    }

    #sb2-splitter-unpinned {
      order: 1;
      margin-inline-start: unset;
      margin-inline-end: calc(-1 * var(--splitter-width));
    }

    #sb2 {
      order: 0;
    }

    #sb2-box {
      padding-inline-start: var(--sb2-box-unpinned-side-padding);
    }
  }
`;
