import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { LogOut, Copy, Check, Moon, Bell } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import LanguageToggle from '../components/ui/LanguageToggle'
import useStudentStore from '../store/useStudentStore'

function Profile() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [darkMode, setDarkMode] = useState(false)
  const [copied, setCopied] = useState(false)
  const { student, recoveryId, clearSession } = useStudentStore()

  const handleClearSession = () => {
    clearSession()
    navigate('/')
  }

  const copyRecoveryId = () => {
    if (recoveryId) {
      navigator.clipboard.writeText(recoveryId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <PageWrapper>
      <div className="mx-auto max-w-2xl space-y-6">
        
        <div className="card flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-700">
              {student.avatar || '🎓'}
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-900">{student.name || 'Student'}</h1>
              <p className="text-sm text-neutral-500">
                {student.standard ? `${student.standard} Standard` : 'Profile incomplete'} 
                {student.stream ? ` • ${student.stream}` : ''}
              </p>
            </div>
          </div>
          <button type="button" className="btn-secondary">Edit</button>
        </div>
        
        {/* Recovery ID Section */}
        <div className="card border-l-4 border-l-brand-500 bg-brand-50/30">
          <h2 className="font-bold text-neutral-900">Your Educational Access ID</h2>
          <p className="text-sm text-neutral-500 mb-3">Save this ID to restore your educational journey on another device securely.</p>
          <div className="flex items-center justify-between rounded-lg bg-white border border-neutral-200 px-4 py-3 font-mono text-lg font-bold tracking-widest text-brand-700">
            <span>{recoveryId || 'NOT-GENERATED'}</span>
            <button 
              onClick={copyRecoveryId}
              className="flex items-center gap-1.5 rounded bg-brand-50 px-2.5 py-1.5 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-100"
            >
              {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
            </button>
          </div>
        </div>

        <div className="card space-y-3 text-sm">
          <h2 className="font-bold text-neutral-900 mb-2">Personal Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mb-1">Community</p>
              <p className="font-medium text-neutral-800">{student.community || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mb-1">District</p>
              <p className="font-medium text-neutral-800">{student.district || 'Not provided'}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider pl-2 mb-2">Settings</h2>
          
          <div className="card p-0 overflow-hidden divide-y divide-neutral-100">
            <div className="flex items-center justify-between p-4 bg-white">
              <span className="text-sm font-medium text-neutral-700">Language Preference</span>
              <LanguageToggle />
            </div>
            
            <label className="flex items-center justify-between p-4 bg-white cursor-pointer hover:bg-neutral-50 transition-colors">
              <div className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                <Moon size={16} className="text-neutral-400" />
                Dark Mode (UI only)
              </div>
              <input type="checkbox" checked={darkMode} onChange={() => setDarkMode((d) => !d)} className="accent-brand-600 w-4 h-4" />
            </label>
            
            <label className="flex items-center justify-between p-4 bg-white cursor-pointer hover:bg-neutral-50 transition-colors">
              <div className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                <Bell size={16} className="text-neutral-400" />
                Notification Preferences
              </div>
              <input type="checkbox" defaultChecked className="accent-brand-600 w-4 h-4" />
            </label>
          </div>
        </div>

        <div className="pt-4">
          <button 
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-100 transition-colors" 
            type="button" 
            onClick={handleClearSession}
          >
            <LogOut size={16} />
            Clear Progress & Start Over
          </button>
        </div>
      </div>
    </PageWrapper>
  )
}

export default Profile
