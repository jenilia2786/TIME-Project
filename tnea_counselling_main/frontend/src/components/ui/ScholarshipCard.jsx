import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'

function ScholarshipCard({ item }) {
  const { t } = useTranslation()
  return (
    <div className="card-hover flex flex-col justify-between">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">{item.provider}</p>
        <h3 className="text-base font-bold text-neutral-900 leading-snug">{item.name}</h3>
        
        <div className="mt-4 border-t border-neutral-100 pt-3">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Grant Amount</p>
          <p className="text-lg font-bold text-emerald-600">{item.amount}</p>
        </div>
        
        <div className="mt-4 space-y-2 text-xs">
          <div>
            <span className="font-semibold text-neutral-800">Eligibility:</span>
            <p className="text-neutral-600 mt-0.5 leading-relaxed">{item.eligibility}</p>
          </div>
          <div className="flex justify-between items-center rounded bg-rose-50 px-2 py-1.5 text-rose-700">
            <span className="font-semibold">Deadline:</span>
            <span className="font-bold">{item.deadline}</span>
          </div>
        </div>
      </div>
      
      <button type="button" className="btn-primary w-full mt-5">
        {t('applyNow')} <ArrowRight size={14} />
      </button>
    </div>
  )
}

export default ScholarshipCard
