// Dependencies: createContext, useContext, useState, useCallback, ReactNode — see DEPENDENCY_GUIDE.md
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { en, es } from '../i18n';
import type { Translations } from '../i18n';

type Language = 'en' | 'es';

interface I18nContextType {
  lang: Language;
  t: Translations;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
}

const translations: Record<Language, Translations> = { en, es };

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const stored = localStorage.getItem('loopy-lang');
    return (stored === 'es' ? 'es' : 'en') as Language;
  });

  const setLang = useCallback((l: Language) => {
    setLangState(l);
    localStorage.setItem('loopy-lang', l);
  }, []);

  const toggleLang = useCallback(() => {
    setLangState(prev => {
      const next = prev === 'en' ? 'es' : 'en';
      localStorage.setItem('loopy-lang', next);
      return next;
    });
  }, []);

  return (
    <I18nContext.Provider value={{ lang, t: translations[lang], setLang, toggleLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
}
