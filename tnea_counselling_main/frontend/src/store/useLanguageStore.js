import { create } from 'zustand'
import i18n from '../i18n'

const useLanguageStore = create((set) => ({
  language: localStorage.getItem('kalvi_lang') || 'ta',
  setLanguage: (lang) => {
    localStorage.setItem('kalvi_lang', lang)
    i18n.changeLanguage(lang)
    set({ language: lang })
  },
  toggleLanguage: () =>
    set((state) => {
      const next = state.language === 'ta' ? 'en' : 'ta'
      localStorage.setItem('kalvi_lang', next)
      i18n.changeLanguage(next)
      return { language: next }
    }),
}))

export default useLanguageStore
