import { L as enUS } from "./en-US.mjs";
import { L as zhCN } from "./zh-CN.mjs";
import { L as ja } from "./ja.mjs";
import { L as ko } from "./ko.mjs";
import { L as de } from "./de.mjs";
import { L as fr } from "./fr.mjs";
import { L as es } from "./es.mjs";
import { L as ptBR } from "./pt-BR.mjs";
import { L as ru } from "./ru.mjs";

const LOCALES = {
  "en-US": enUS,
  "zh-CN": zhCN,
  ja: ja,
  ko: ko,
  de: de,
  fr: fr,
  es: es,
  "pt-BR": ptBR,
  ru: ru,
};

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
