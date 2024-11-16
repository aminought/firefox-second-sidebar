export const SIDEBAR_BOX_CSS = `
  #sidebar-2-box {
    background-color: var(--toolbar-bgcolor);
    min-width: 200px;
    pointer-events: none;
    box-sizing: content-box;
  }

  #browser:has(#sidebar-2[pinned="true"]) {
    #sidebar-2-box-filler {
      display: none;
    }

    #sidebar-2-splitter-unpinned {
      display: none;
    }

    #sidebar-2-splitter-pinned {
      display: flex;
    }
  }

  #browser:has(#sidebar-2[pinned="false"]) {
    #sidebar-2-box {
      position: absolute;
      background-color: transparent;
      height: calc(100% - 2 * var(--space-small));
      width: 100% !important;
      padding-block-start: var(--space-small);
      z-index: 3;

      #sidebar-2-box-filler {
        display: block;
        flex: 1;
        pointer-events: none;
      }

      #sidebar-2-splitter-unpinned {
        display: flex;
        pointer-events: auto;
        border: unset;
      }
    }

    #sidebar-2-splitter-pinned {
      display: none;
    }
  }

  #browser:has(#sidebar-2[pinned="true"][position="right"]) {
    #sidebar-2-box {
      order: 6 !important;
      padding-inline-start: var(--space-small);
      padding-inline-end: 1px;
    }

    #sidebar-2-splitter-pinned {
      order: 5 !important;
      margin-inline-start: unset;
      margin-inline-end: calc(-1 * var(--splitter-width));
    }
  }

  #browser:has(#sidebar-2[pinned="true"][position="left"]) {
    #sidebar-2-box {
      order: -2 !important;
      padding-inline-start: 1px;
      padding-inline-end: var(--space-small);
    }

    #sidebar-2-splitter-pinned {
      order: -1 !important;
      margin-inline-start: calc(-1 * var(--splitter-width));
      margin-inline-end: unset;
    }
  }

  #browser:has(#sidebar-2[pinned="false"][position="right"]) {
    #sidebar-2-box-filler {
      order: 0 !important;
    }

    #sidebar-2-splitter-unpinned {
      order: 1 !important;
      margin-inline-start: calc(-1 * var(--splitter-width));
      margin-inline-end: unset;
    }

    #sidebar-2 {
      order: 2 !important;
    }

    #sidebar-2-box {
      right: var(--sidebar-2-main-width);
      padding-inline-end: var(--space-small);
    }
  }

  #browser:has(#sidebar-2[pinned="false"][position="left"]) {
    #sidebar-2-box-filler {
      order: 2 !important;
    }

    #sidebar-2-splitter-unpinned {
      order: 1 !important;
      margin-inline-start: unset;
      margin-inline-end: calc(-1 * var(--splitter-width));
    }

    #sidebar-2 {
      order: 0 !important;
    }

    #sidebar-2-box {
      left: var(--sidebar-2-main-width);
      padding-inline-start: var(--space-small);
    }
  }
`;
