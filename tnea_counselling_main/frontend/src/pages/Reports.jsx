import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, Download, Brain, BarChart2, Building2,
  GraduationCap, FlaskConical, Target, Star, Sparkles,
  CheckCircle, TrendingUp, Map, BookOpen, Zap, ChevronRight, Shield, Cpu
} from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import useStudentStore from '../store/useStudentStore'
import useThemeStore from '../store/useThemeStore'

const REPORT_SECTIONS = [
  { id: 'profile', label: 'Profile Summary', icon: Star, desc: 'Personal info, academic background, preferences', color: 'from-brand-400 to-cyan-400', included: true },
  { id: 'domain', label: 'Domain Compatibility', icon: BarChart2, desc: 'AI-scored compatibility across all education domains', color: 'from-violet-400 to-purple-400', included: true },
  { id: 'subjects', label: 'Subject Analysis', icon: BookOpen, desc: 'Strength/weakness analysis with recommendations', color: 'from-sky-400 to-blue-400', included: true },
  { id: 'colleges', label: 'Recommended Colleges', icon: Building2, desc: 'Dream, target and safe college lists', color: 'from-emerald-400 to-teal-400', included: true },
  { id: 'scholarships', label: 'Scholarship Eligibility', icon: GraduationCap, desc: 'Matched scholarships with eligibility details', color: 'from-amber-400 to-orange-400', included: true },
  { id: 'exams', label: 'Exam Readiness', icon: FlaskConical, desc: 'Entrance exam preparation status and scores', color: 'from-rose-400 to-pink-400', included: false },
  { id: 'roadmap', label: 'Educational Roadmap', icon: Map, desc: 'Personalized journey plan and milestones', color: 'from-indigo-400 to-blue-500', included: false },
  { id: 'ai', label: 'AI Summary', icon: Brain, desc: 'Comprehensive AI-generated educational intelligence report', color: 'from-brand-500 to-violet-500', included: true },
]

const REPORT_TYPES = [
  { id: 'full', label: 'Full Report', desc: 'Complete educational intelligence report', sections: 8, color: 'from-brand-500 to-violet-500', glow: 'rgba(20,184,166,0.3)' },
  { id: 'parent', label: 'Parent Report', desc: 'Simplified overview for parents', sections: 5, color: 'from-emerald-500 to-teal-500', glow: 'rgba(16,185,129,0.3)' },
  { id: 'career', label: 'Career Report', desc: 'Career compatibility and domain analysis', sections: 4, color: 'from-violet-500 to-purple-600', glow: 'rgba(139,92,246,0.3)' },
  { id: 'college', label: 'College Report', desc: 'College shortlist with cutoff predictions', sections: 3, color: 'from-amber-500 to-orange-500', glow: 'rgba(245,158,11,0.3)' },
]

const DOMAIN_SCORES = [
  { domain: 'AI Engineering', score: 92, color: 'from-brand-400 to-cyan-500', icon: Brain },
  { domain: 'Data Science', score: 87, color: 'from-sky-400 to-blue-500', icon: BarChart2 },
  { domain: 'Cybersecurity', score: 81, color: 'from-violet-400 to-purple-500', icon: Shield },
  { domain: 'Robotics', score: 76, color: 'from-emerald-400 to-teal-500', icon: Cpu },
  { domain: 'Biomedical', score: 68, color: 'from-rose-400 to-pink-500', icon: FlaskConical },
  { domain: 'Civil Engineering', score: 62, color: 'from-amber-400 to-orange-500', icon: Building2 },
]

/* ── Report Preview Card ─────────────────────────────────── */
function ReportPreview({ student }) {
  const displayName = student.name || 'Student'
  const isDark = useThemeStore((s) => s.theme) === 'dark'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-3xl border"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #0f172a, #1e293b)'
          : 'linear-gradient(135deg, #f0fdf4 0%, #ecfeff 50%, #f0fdfa 100%)',
        boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.25)' : '0 20px 60px rgba(20,184,166,0.1)',
        borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(20,184,166,0.15)',
      }}
    >
      {/* Particle bg */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 rounded-full bg-brand-400"
            style={{ left: `${(i % 4) * 25 + 12}%`, top: `${Math.floor(i / 4) * 28 + 8}%` }}
            animate={{ opacity: [0.2, 1, 0.2], scale: [1, 2, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-1">AI Educational Report</p>
            <h3 className="text-lg font-black text-neutral-900 dark:text-white">{displayName}</h3>
            <p className="text-neutral-500 dark:text-slate-400 text-xs">{student.standard || '12th Grade'} · {student.district || 'Tamil Nadu'}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-400 to-violet-500 flex items-center justify-center"
            style={{ boxShadow: '0 0 20px rgba(20,184,166,0.4)' }}>
            <Brain size={22} className="text-white" />
          </div>
        </div>

        {/* Domain Scores */}
        <p className="text-[10px] font-black text-neutral-500 dark:text-slate-400 uppercase tracking-widest mb-4">Domain Compatibility</p>
        <div className="space-y-3 mb-6">
          {DOMAIN_SCORES.slice(0, 4).map((d, i) => (
            <div key={d.domain}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <d.icon size={14} className="text-brand-500 dark:text-white" />
                  <span className="text-xs font-semibold text-neutral-700 dark:text-slate-300">{d.domain}</span>
                </div>
                <span className="text-xs font-black text-neutral-900 dark:text-white">{d.score}%</span>
              </div>
              <div className="h-1.5 bg-neutral-200 dark:bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${d.score}%` }}
                  transition={{ duration: 1.2, delay: i * 0.12 + 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className={`h-full rounded-full bg-gradient-to-r ${d.color}`}
                  style={{ boxShadow: '0 0 6px rgba(20,184,166,0.4)' }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 p-3 bg-brand-50 dark:bg-white/5 rounded-xl border border-brand-100 dark:border-white/10">
          <Sparkles size={12} className="text-brand-500 dark:text-brand-400" />
          <p className="text-[10px] text-brand-700 dark:text-slate-400 font-medium">AI-generated report ready for download</p>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Section Toggle ──────────────────────────────────────── */
function SectionToggle({ section, included, onToggle }) {
  const Icon = section.icon
  return (
    <motion.div
      whileHover={{ x: 2 }}
      className="flex items-center gap-3 p-3.5 rounded-xl border border-neutral-100 bg-white hover:border-neutral-200 transition-all cursor-pointer"
      onClick={onToggle}
    >
      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center shrink-0`}>
        <Icon size={14} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-neutral-800">{section.label}</p>
        <p className="text-[10px] text-neutral-400 leading-snug">{section.desc}</p>
      </div>
      <motion.div
        animate={{ scale: included ? 1 : 0.8 }}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
          included ? 'bg-brand-500 border-brand-500' : 'border-neutral-200 bg-white'
        }`}
      >
        {included && <CheckCircle size={10} className="text-white" />}
      </motion.div>
    </motion.div>
  )
}

/* ── Main Reports Page ───────────────────────────────────── */
export default function Reports() {
  const student = useStudentStore((s) => s.student)
  const profileCompletion = useStudentStore((s) => s.profileCompletion)
  const collapsed = useThemeStore((s) => s.sidebarCollapsed)
  const [sections, setSections] = useState(REPORT_SECTIONS)
  const [selectedType, setSelectedType] = useState('full')
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  const toggleSection = (id) => {
    setSections((prev) => prev.map((s) => s.id === id ? { ...s, included: !s.included } : s))
  }

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      setGenerated(true)
    }, 2500)
  }

  const handleDownload = () => {
    // Generate a printable HTML report from student data
    const name = student.name || 'Student'
    const standard = student.standard || 'Not specified'
    const district = student.district || 'Tamil Nadu'
    const community = student.community || 'Not specified'
    const cutoff = student.computedCutoff > 0 ? `${student.computedCutoff}/200` : 'Not calculated'
    const interests = (student.interests || []).join(', ') || 'Not specified'
    const goals = (student.careerGoals || []).join(', ') || 'Not specified'
    const strong = (student.strongSubjects || []).join(', ') || 'Not specified'
    const weak = (student.weakSubjects || []).join(', ') || 'Not specified'
    const hostel = student.hostelRequired || 'Not specified'
    const budget = student.budget || 'Not specified'
    const board = student.board || 'Not specified'
    const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

    const reportHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>T.I.M.E — Educational Intelligence Report — ${name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=Space+Grotesk:wght@700;900&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; color: #0f172a; background: #fff; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 24px; border-bottom: 2px solid #e2e8f0; margin-bottom: 28px; }
    .logo { font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 900; color: #0f766e; }
    .logo span { color: #8b5cf6; }
    .header-meta { text-align: right; color: #64748b; font-size: 12px; }
    h1 { font-family: 'Space Grotesk', sans-serif; font-size: 28px; font-weight: 900; color: #0f172a; margin-bottom: 4px; }
    .subtitle { color: #64748b; font-size: 14px; margin-bottom: 28px; }
    .section { margin-bottom: 28px; }
    .section-title { font-family: 'Space Grotesk', sans-serif; font-size: 13px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #0f766e; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .info-item { background: #f8fafc; padding: 12px 14px; border-radius: 10px; border: 1px solid #e2e8f0; }
    .info-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; margin-bottom: 3px; }
    .info-value { font-size: 14px; font-weight: 600; color: #0f172a; }
    .score-bar { background: #e2e8f0; border-radius: 99px; height: 8px; overflow: hidden; margin-top: 6px; }
    .score-fill { background: linear-gradient(90deg, #14b8a6, #8b5cf6); height: 100%; border-radius: 99px; }
    .domain-row { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
    .domain-name { font-size: 13px; font-weight: 600; color: #334155; min-width: 150px; }
    .domain-score { font-size: 13px; font-weight: 900; color: #0f766e; margin-left: auto; min-width: 40px; text-align: right; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 700; background: #e0fef4; color: #0f766e; margin: 2px; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 11px; display: flex; justify-content: space-between; }
    .ai-box { background: linear-gradient(135deg, #e0fef4, #ede9fe); padding: 16px; border-radius: 12px; border: 1px solid #a7f3d0; }
    .ai-title { font-weight: 900; color: #0f766e; font-size: 13px; margin-bottom: 6px; }
    .ai-text { font-size: 13px; color: #1e293b; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">T.I.M.E <span>Guidance</span></div>
      <div style="color: #64748b; font-size: 12px; margin-top: 2px;">Educational Intelligence Platform</div>
    </div>
    <div class="header-meta">
      <div style="font-weight: 700;">Educational Intelligence Report</div>
      <div>Generated: ${today}</div>
      <div>Confidential — For Student Use Only</div>
    </div>
  </div>

  <h1>${name}</h1>
  <p class="subtitle">${standard} · ${district} · Community: ${community}</p>

  <div class="section">
    <div class="section-title">Profile Summary</div>
    <div class="grid-2">
      <div class="info-item"><div class="info-label">Standard</div><div class="info-value">${standard}</div></div>
      <div class="info-item"><div class="info-label">Board</div><div class="info-value">${board}</div></div>
      <div class="info-item"><div class="info-label">District</div><div class="info-value">${district}</div></div>
      <div class="info-item"><div class="info-label">Community</div><div class="info-value">${community}</div></div>
      <div class="info-item"><div class="info-label">Computed Cutoff</div><div class="info-value">${cutoff}</div></div>
      <div class="info-item"><div class="info-label">Hostel Required</div><div class="info-value">${hostel}</div></div>
      <div class="info-item"><div class="info-label">Budget Range</div><div class="info-value">${budget}</div></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Interests & Career Goals</div>
    <div class="info-item" style="margin-bottom: 10px;"><div class="info-label">Interests</div><div class="info-value">${interests}</div></div>
    <div class="info-item"><div class="info-label">Career Goals</div><div class="info-value">${goals}</div></div>
  </div>

  <div class="section">
    <div class="section-title">Subject Analysis</div>
    <div class="grid-2">
      <div class="info-item"><div class="info-label">Strong Subjects</div><div class="info-value" style="color:#0f766e">${strong}</div></div>
      <div class="info-item"><div class="info-label">Needs Improvement</div><div class="info-value" style="color:#dc2626">${weak}</div></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Domain Compatibility</div>
    ${DOMAIN_SCORES.map(d => `
    <div class="domain-row">
      <div class="domain-name">${d.domain}</div>
      <div style="flex:1"><div class="score-bar"><div class="score-fill" style="width:${d.score}%"></div></div></div>
      <div class="domain-score">${d.score}%</div>
    </div>`).join('')}
  </div>

  <div class="section">
    <div class="section-title">AI Recommendation Summary</div>
    <div class="ai-box">
      <div class="ai-title">🤖 T.I.M.E AI Analysis</div>
      <div class="ai-text">
        Based on your profile, <strong>${name}</strong> shows strong aptitude in ${strong !== 'Not specified' ? strong : 'multiple subjects'}.
        With a computed TNEA cutoff of <strong>${cutoff}</strong> under the <strong>${community}</strong> category,
        you are well-positioned for top engineering programs in ${district} and across Tamil Nadu.
        ${interests !== 'Not specified' ? `Your interest in <strong>${interests}</strong> aligns with high-demand career paths.` : ''}
        Prioritize completing the College Finder and shortlisting Safe, Moderate, and Dream colleges for counselling.
      </div>
    </div>
  </div>

  <div class="footer">
    <span>T.I.M.E Educational Guidance Platform · Generated for ${name}</span>
    <span>${today} · Confidential</span>
  </div>

  <script>window.print(); window.onafterprint = () => window.close();</script>
</body>
</html>`

    const win = window.open('', '_blank')
    if (win) {
      win.document.write(reportHTML)
      win.document.close()
    }
  }

  const includedCount = sections.filter((s) => s.included).length

  return (
    <PageWrapper>
      <div className="w-full max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-3 transition-all duration-300`}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center shrink-0"
            style={{ boxShadow: '0 4px 15px rgba(99,102,241,0.4)' }}>
            <FileText size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-neutral-900 dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Reports
            </h1>
            <p className="text-sm text-neutral-500">Generate comprehensive AI educational intelligence reports</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel */}
          <div className="lg:col-span-7 space-y-5">
            {/* Report Type Selector */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-neutral-100 p-5"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
            >
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-4">Report Type</p>
              <div className="grid grid-cols-2 gap-3">
                {REPORT_TYPES.map((type) => (
                  <motion.button
                    key={type.id}
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedType(type.id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      selectedType === type.id
                        ? 'border-transparent ring-2 shadow-md'
                        : 'border-neutral-100 hover:border-neutral-200 bg-white'
                    }`}
                    style={selectedType === type.id ? {
                      background: `linear-gradient(135deg, rgba(20,184,166,0.06), rgba(139,92,246,0.06))`,
                      ringColor: '#14b8a6',
                      boxShadow: `0 4px 20px ${type.glow}`,
                    } : {}}
                  >
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-2`}
                      style={{ boxShadow: selectedType === type.id ? `0 4px 12px ${type.glow}` : 'none' }}>
                      <FileText size={14} className="text-white" />
                    </div>
                    <p className="text-xs font-black text-neutral-800">{type.label}</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5 leading-snug">{type.desc}</p>
                    <p className="text-[9px] font-bold text-brand-600 mt-1">{type.sections} sections</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Section Customizer */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl border border-neutral-100 p-5"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Customize Sections</p>
                <span className="text-[10px] font-bold text-brand-600">{includedCount} of {sections.length} included</span>
              </div>
              <div className="space-y-2">
                {sections.map((section) => (
                  <SectionToggle
                    key={section.id}
                    section={section}
                    included={section.included}
                    onToggle={() => toggleSection(section.id)}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-5 space-y-4">
            {/* Preview */}
            <ReportPreview student={student} />

            {/* Profile completeness warning */}
            {profileCompletion < 60 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-xl bg-amber-50 border border-amber-100"
              >
                <div className="flex items-start gap-2">
                  <Zap size={13} className="text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-amber-700">Complete Your Profile</p>
                    <p className="text-[10px] text-amber-600 mt-0.5">Your profile is {profileCompletion}% complete. Complete it for a more accurate report.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Generate Button */}
            <AnimatePresence mode="wait">
              {!generated ? (
                <motion.button
                  key="generate"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerate}
                  disabled={generating}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-violet-600 text-white font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2"
                  style={{ boxShadow: '0 8px 30px rgba(20,184,166,0.4)' }}
                >
                  {generating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      AI Generating Report...
                    </>
                  ) : (
                    <>
                      <Brain size={16} />
                      Generate AI Report
                    </>
                  )}
                </motion.button>
              ) : (
                <motion.div
                  key="download"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <CheckCircle size={16} className="text-emerald-500" />
                    <p className="text-sm font-bold text-emerald-700">Report Generated Successfully!</p>
                  </div>
                  {[
                    { label: 'Download Full PDF', icon: Download, gradient: 'from-brand-500 to-violet-600', glow: '0 8px 30px rgba(20,184,166,0.4)', action: handleDownload },
                    { label: 'Share Report Link', icon: ChevronRight, gradient: 'from-amber-500 to-orange-500', glow: '0 8px 30px rgba(245,158,11,0.4)', action: () => navigator.clipboard?.writeText(window.location.href) },
                  ].map((btn) => {
                    const BIcon = btn.icon
                    return (
                      <motion.button
                        key={btn.label}
                        onClick={btn.action}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3.5 rounded-2xl text-white text-sm font-bold flex items-center justify-center gap-2 transition-all"
                        style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))`, boxShadow: btn.glow }}
                      >
                        <div className={`py-3.5 w-full rounded-2xl bg-gradient-to-r ${btn.gradient} text-white text-sm font-bold flex items-center justify-center gap-2`}
                          style={{ boxShadow: btn.glow }}>
                          <BIcon size={15} />
                          {btn.label}
                        </div>
                      </motion.button>
                    )
                  })}

                  <button
                    onClick={() => setGenerated(false)}
                    className="w-full text-xs text-neutral-400 hover:text-neutral-600 transition-colors py-2"
                  >
                    Generate New Report
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
