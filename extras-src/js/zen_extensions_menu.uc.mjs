// ==UserScript==
// @name            Zen Extensions Menu
// @description     A Firefox userChrome.js script for adding a Zen Extensions Menu to the browser toolbar.
// @author          k00lagin
// @include         about:addons
// ==/UserScript==

const pageLoaded = () => {
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            let header = document.querySelector("#page-header");
            if (!header) {
                return;
            }

            if (header.getAttribute("current-param") === "extension") {
                clearInterval(interval);
                resolve();
            } else {
                clearInterval(interval);
                reject();
            }
        }, 100);
    });
}

const run = () => {
    if (!navigator.userAgent.toLowerCase().includes("mobile")) {
        return;
    }

    pageLoaded().then(() => {
        const css = /*css*/`
            body {
                overflow-y: auto !important;
                overflow-x: clip;
                padding: var(--space-small);
            }

            #main {
                margin: 0;
            }

            #content {
                width: calc(100vw - var(--space-small) * 2);
            }

            .sticky-container {
                position: relative;
            }

            .main-heading {
                padding: var(--space-medium);
                margin: 0;
            }

            .extension-enable-button::after {
                content: "";
                display: block;
                background-color: transparent;
                position: absolute;
                border-radius: 5px;
                inset: 0;
            }

            addon-card {
                pointer-events: none;
            }

            .extension-enable-button {
                pointer-events: auto;
            }

            .extension-enable-button:hover::after {
                background-color: color-mix(in srgb, var(--toolbarbutton-hover-background) 50%, transparent 50%);
            }

            #sidebar,
            .main-search,
            .page-options-menu,
            global-warnings,
            .more-options-button,
            .addon-description,
            .addon-card-message {
                display: none;
            }

            .list-section-heading {
                height: 0;
                overflow: hidden;
                border-top: 1px solid var(--zen-colors-border);
                margin: var(--space-small) 0;
            }

            .addon.card {
                border-width: 0;
                background-color: transparent;
                position: relative;
                box-shadow: unset !important;
                margin: 0;
                padding: var(--space-medium);
            }

            .addon-icon {
                width: 20px !important;
                height: 20px !important;
            }

            .header-name,
            .addon-name {
                font-size: var(--font-size-small);
                line-height: normal !important;
            }

            .addon-name-container {
                margin: 0;
            }

            .addon-badge {
                box-sizing: border-box;
                width: 20px;
                height: 20px;
            }
        `;
        
        const style = document.createElement("style");
        style.textContent = css;
        document.head.appendChild(style);
    });
};

if (typeof UC_API !== "undefined") {
    UC_API.Runtime.startupFinished().then(run);
} else {
    delayedStartupPromise.then(run);
}
