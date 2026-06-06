import { Bell } from 'lucide-react'
import notifications from '../../data/notifications'
import useStudentStore from '../../store/useStudentStore'
import useLanguageStore from '../../store/useLanguageStore'

function NotificationPanel() {
  const { notificationsOpen, toggleNotifications } = useStudentStore()
  const { language } = useLanguageStore()

  return (
    <div className="relative">
      <button onClick={toggleNotifications} className="relative rounded-full p-2 hover:bg-sky-100" type="button">
        <Bell size={20} />
        <span className="absolute -right-1 -top-1 rounded-full bg-secondary px-1 text-xs text-white">5</span>
      </button>
      {notificationsOpen && (
        <div className="absolute right-0 top-12 z-40 w-80 rounded-2xl border border-sky-100 bg-white dark:bg-slate-800 p-3 shadow-xl">
          {notifications.map((n) => (
            <div key={n.id} className="mb-2 rounded-xl bg-sky-50 p-2 text-sm last:mb-0">
              <p>{language === 'ta' ? n.textTa : n.textEn}</p>
              <p className="text-xs text-slate-500">{n.time}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default NotificationPanel
