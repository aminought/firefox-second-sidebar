import { FaviconsWrapper } from "../wrappers/favicons.mjs";
import { NetUtilWrapper } from "../wrappers/net_utils.mjs";

const PREDEFINED_ICONS = {
  "about:newtab": "chrome://branding/content/icon32.png",
  "about:home": "chrome://branding/content/icon32.png",
  "about:welcome": "chrome://branding/content/icon32.png",
  "about:privatebrowsing": "chrome://browser/skin/privatebrowsing/favicon.svg",
  "about:debugging": "chrome://global/skin/icons/developer.svg",
  "about:config": "chrome://global/skin/icons/settings.svg",
  "about:processes": "chrome://global/skin/icons/performance.svg",
  "about:addons": "chrome://mozapps/skin/extensions/extension.svg",
  "about:settings": "chrome://global/skin/icons/settings.svg",
  "about:preferences": "chrome://global/skin/icons/settings.svg",
  "chrome://browser/content/preferences/preferences.xhtml":
    "chrome://global/skin/icons/settings.svg",
  "chrome://browser/content/places/bookmarksSidebar.xhtml":
    "chrome://browser/skin/bookmark.svg",
  "about:downloads": "chrome://browser/skin/downloads/downloads.svg",
  "chrome://browser/content/downloads/contentAreaDownloadsView.xhtml":
    "chrome://browser/skin/downloads/downloads.svg",
  "chrome://browser/content/places/places.xhtml":
    "chrome://browser/skin/library.svg",
};

export const FALLBACK_ICON = "chrome://global/skin/icons/defaultFavicon.svg";

/**
 *
 * @param {string} url
 * @returns {Promise<string>}
 */
export function fetchIconURL(url) {
  return new Promise((resolve) => {
    const uri = NetUtilWrapper.newURI(url);
    if (uri.specIgnoringRef in PREDEFINED_ICONS) {
      resolve(PREDEFINED_ICONS[uri.specIgnoringRef]);
    }

    FaviconsWrapper.setDefaultIconURIPreferredSize(32);
    FaviconsWrapper.getFaviconURLForPage(uri, async (faviconURI) => {
      let provider = "browser";
      let faviconURL = faviconURI?.spec;
      try {
        if (!faviconURL) {
          provider = "google";
          faviconURL = `https://www.google.com/s2/favicons?domain=${uri.host}&sz=32`;
          const response = await fetch(faviconURL);
          if (response.status !== 200) {
            throw Error(`Got ${response.status} from ${provider}`);
          }
        }
      } catch (error) {
        console.log(
          `Failed to fetch icon ${faviconURL} from provider ${provider}:`,
          error,
        );
        provider = "fallback";
        faviconURL = FALLBACK_ICON;
      }
      console.log(`Got favicon for ${url} from ${provider}`);
      resolve(faviconURL);
    });
  });
}

/**
 *
 * @param {string} url
 * @returns {Promise<boolean>}
 */
export async function isIconAvailable(url) {
  try {
    const response = await fetch(url, { credentials: "include" });
    return response.status === 200;
  } catch {
    return false;
  }
}

/**
 *
 * @param {string} url
 * @param {string} urlAlt
 * @returns {Promise<string>}
 */
export async function useAvailableIcon(url, urlAlt) {
  return (await isIconAvailable(url)) ? url : urlAlt;
}
