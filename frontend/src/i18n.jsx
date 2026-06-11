// Bilingual support (English / Macedonian).
//   const t = useT(); t('Save')            -> looks up MK.ui['Save'] when in MK
//   const t = useT(); t('Save', 'Зачувај')  -> inline MK
// A module-level language mirror lets non-React helpers (utils labels) translate
// without each call site passing both strings.
import { createContext, useCallback, useContext, useState } from 'react'
import { MK } from './mkContent.js'

const KEY = 'psylearn_lang'
const LangContext = createContext({ lang: 'en', setLang: () => {}, t: (en) => en })

let _lang = 'en'
try {
  _lang = localStorage.getItem(KEY) === 'mk' ? 'mk' : 'en'
} catch {
  _lang = 'en'
}

export function getLang() {
  return _lang
}

// Translate a string: inline MK wins, else the shared UI dictionary, else English.
export function translate(en, mk) {
  if (_lang !== 'mk') return en
  if (mk != null) return mk
  return (MK.ui && MK.ui[en]) || en
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(_lang)

  const setLang = useCallback((l) => {
    _lang = l === 'mk' ? 'mk' : 'en'
    setLangState(_lang)
    try {
      localStorage.setItem(KEY, _lang)
    } catch {
      /* ignore */
    }
  }, [])

  const t = useCallback((en, mk) => (lang === 'mk' ? (mk != null ? mk : (MK.ui && MK.ui[en]) || en) : en), [lang])

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}

export function useT() {
  return useContext(LangContext).t
}
