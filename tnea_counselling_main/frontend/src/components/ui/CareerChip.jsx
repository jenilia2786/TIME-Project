function CareerChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-11 rounded-full px-4 text-sm ${active ? 'bg-primary text-white' : 'border border-sky-200 bg-white dark:bg-slate-800 text-slate-700'}`}
    >
      {label}
    </button>
  )
}

export default CareerChip
