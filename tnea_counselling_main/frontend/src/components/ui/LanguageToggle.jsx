import useLanguageStore from '../../store/useLanguageStore'

function LanguageToggle() {
  const { language, toggleLanguage } = useLanguageStore()

  return (
    <button
      onClick={toggleLanguage}
      className="min-h-11 rounded-full border border-primary px-4 text-sm font-semibold text-primary"
      type="button"
    >
      {language === 'ta' ? 'தமிழ்' : 'EN'}
    </button>
  )
}

export default LanguageToggle
