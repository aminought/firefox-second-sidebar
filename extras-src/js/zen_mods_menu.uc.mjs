// ==UserScript==
// @name            Zen Mods Menu
// @description     A Firefox userChrome.js script for adding a Zen Mods Menu to the browser toolbar.
// @author          k00lagin
// @include         about:preferences#zenMarketplace
// ==/UserScript==

const run = () => { 
    if (navigator.userAgent.toLowerCase().includes("mobile")) {
        const css = /*css*/`
            body {
                overflow-y: auto !important;
            }

            .main-content,
            #zenMarketplaceGroup {
                display: contents;        
            }
            
            .main-content > .pane-container {
                margin: 0;
            }

            .navigation,
            #ZenMarketplaceCategory,
            [data-l10n-id="zen-theme-marketplace-description"],
            [data-l10n-id="zen-theme-marketplace-link"],
            [data-l10n-id="zen-theme-marketplace-check-for-updates-button"],
            .zenThemeMarketplaceItemActions,
            .zenThemeMarketplaceItemDescription {
                display: none;
            }

            #mainPrefPane {
                padding: var(--space-small) !important;
            }

            #zenMarketplaceHeader {
                border-radius: 5px;
                padding: var(--space-medium);
                justify-content: space-between;
                align-items: center;
                flex-direction: row;
                cursor: default;
            }

            #zenMarketplaceHeader > * {
                font-size: var(--font-size-small);
                opacity: 1;
            }
            
            #zenMarketplaceGroup {
                background-color: transparent;
            }

            #zenThemeMarketplaceList {
                display: contents;
            }

            .zenThemeMarketplaceItem {
                border-width: 0;
            }

            .zenThemeMarketplaceItem label {
                margin: 0;
            }

            #zenMarketplaceHeader:hover,
            .zenThemeMarketplaceItem:hover {
                background-color: color-mix(in srgb, var(--toolbarbutton-hover-background) 50%, transparent 50%);
            }

            .zenThemeMarketplaceItem h3 {
                font-size: var(--font-size-small);
            }

            toolbarseparator {
                border-top: 1px solid var(--panel-separator-color);
                margin: var(--space-small) 0;
            }
        `;
        
        const style = document.createElement("style");
        style.textContent = css;
        document.head.appendChild(style);

        const separator = document.createElement("toolbarseparator");
        let zenThemeMarketplaceList = document.querySelector("#zenThemeMarketplaceList");
        zenThemeMarketplaceList.parentNode.insertBefore(separator, zenThemeMarketplaceList);
    }
};

if (typeof UC_API !== "undefined") {
    UC_API.Runtime.startupFinished().then(run);
} else {
    delayedStartupPromise.then(run);
}
