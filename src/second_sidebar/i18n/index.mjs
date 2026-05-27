import { L as enUS } from "./en-US.mjs";
import { L as zhCN } from "./zh-CN.mjs";

const LOCALES = { "en-US": enUS, "zh-CN": zhCN };

function getBrowserLocale() {
  try {
    return Services.locale.requestedLocale;
  } catch {
    try {
      return navigator.language;
    } catch {
      return "en-US";
    }
  }
}

function findBestMatch(locale) {
  if (!locale) return "en-US";
  const normalized = locale.replace(/_/g, "-");
  if (LOCALES[normalized]) return normalized;
  const prefix = normalized.split("-")[0];
  for (const key of Object.keys(LOCALES)) {
    if (key.startsWith(prefix)) return key;
  }
  return "en-US";
}

export const L = LOCALES[findBestMatch(getBrowserLocale())];
