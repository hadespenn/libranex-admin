import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import en from "./en";
import zhCN from "./zh-CN";
import zhTW from "./zh-TW";

export const SUPPORTED_LANGS = ["zh-CN", "zh-TW", "en"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];

type NestedDict = { [k: string]: unknown };
const DICTS: Record<Lang, NestedDict> = { "zh-CN": zhCN, "zh-TW": zhTW, en };

const STORAGE_KEY = "libranex-lang";

function getInitialLang(): Lang {
  if (typeof localStorage !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved && (SUPPORTED_LANGS as readonly string[]).includes(saved)) return saved;
  }
  return "zh-CN";
}

/** 支持 'a.b.c' 形式的嵌套查找 */
function lookup(dict: NestedDict, key: string): string | undefined {
  const parts = key.split(".");
  let cur: unknown = dict;
  for (const p of parts) {
    if (cur && typeof cur === "object" && !Array.isArray(cur)) {
      cur = (cur as NestedDict)[p];
    } else {
      return undefined;
    }
  }
  return typeof cur === "string" ? cur : undefined;
}

interface I18nContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }): JSX.Element {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  const setLang = useCallback((l: Lang) => {
    if (typeof localStorage !== "undefined") localStorage.setItem(STORAGE_KEY, l);
    setLangState(l);
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const dict = DICTS[lang];
      let val = lookup(dict, key);
      if (val === undefined) {
        // 回退到简体中文，再回退到 key 本身
        const fallback = lookup(DICTS["zh-CN"], key);
        val = fallback ?? key;
      }
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          val = val.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        }
      }
      return val;
    },
    [lang],
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export const useT = useI18n;
