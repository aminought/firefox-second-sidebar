const PREDEFINED_ICONS = {
  "about:newtab": "chrome://browser/skin/tab.svg",
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

export function fetchIconURL(url) {
  const uri = NetUtil.newURI(url);
  if (uri.specIgnoringRef in PREDEFINED_ICONS) {
    return PREDEFINED_ICONS[uri.specIgnoringRef];
  }

  Favicons.setDefaultIconURIPreferredSize(32);

  return new Promise((resolve) => {
    Favicons.getFaviconURLForPage(uri, async (faviconURI) => {
      let provider = "browser";
      let faviconURL = faviconURI?.spec;
      try {
        if (!faviconURL) {
          provider = "google";
          faviconURL = `https://www.google.com/s2/favicons?domain=${uri.host}&sz=32`;
          const response = await fetch(faviconURL);
          if (response.status !== 200) {
            throw Error(`Got ${response.status} from google`);
          }
        }
      } catch (error) {
        console.log("Failed to fetch icon:", error);
        provider = "fallback";
        faviconURL = "chrome://devtools/skin/images/browsers/firefox.svg";
      }
      console.log(`Got favicon for ${url} from ${provider}`);
      resolve(faviconURL);
    });
  });
}
