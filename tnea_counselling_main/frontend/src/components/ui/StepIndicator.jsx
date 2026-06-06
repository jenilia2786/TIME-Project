import { useTranslation } from 'react-i18next'

function StepIndicator({ currentStep, totalSteps = 5 }) {
  const { t } = useTranslation()
  return (
    <div className="mb-4">
      <p className="mb-2 text-sm text-slate-600">{t('step')} {currentStep} / {totalSteps}</p>
      <div className="h-2 rounded-full bg-sky-100">
        <div className="h-2 rounded-full bg-primary" style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
      </div>
    </div>
  )
}

export default StepIndicator
