import { useState, useEffect } from 'react'

function AppDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:8000/api/profile/1')
      .then(res => res.json())
      .then(data => {
        setProfile(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch profile:", err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center text-primary font-bold text-xl">Initializing your career intelligence...</div>
  }

  return (
    <div className="flex h-screen w-full p-4 gap-6 font-sans text-gray-900 box-border">
      {/* Floating Glass Sidebar */}
      <aside className="w-64 glass rounded-3xl flex flex-col items-center py-8 shadow-sm">
        <div className="text-2xl font-bold text-primary mb-10 tracking-tight glow-effect rounded-lg p-2 bg-white/50">Guider.AI</div>
        <nav className="flex flex-col w-full px-4 gap-3">
          <button 
            className={`py-3 px-4 rounded-2xl text-left transition-all font-medium ${activeTab === 'dashboard' ? 'bg-primary text-white shadow-md shadow-primary/30 hover-lift' : 'text-gray-600 hover:bg-white/60 hover:shadow-sm'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`py-3 px-4 rounded-2xl text-left transition-all font-medium ${activeTab === 'roadmap' ? 'bg-primary text-white shadow-md shadow-primary/30 hover-lift' : 'text-gray-600 hover:bg-white/60 hover:shadow-sm'}`}
            onClick={() => setActiveTab('roadmap')}
          >
            Career Roadmap
          </button>
          <button 
            className={`py-3 px-4 rounded-2xl text-left transition-all font-medium ${activeTab === 'skills' ? 'bg-primary text-white shadow-md shadow-primary/30 hover-lift' : 'text-gray-600 hover:bg-white/60 hover:shadow-sm'}`}
            onClick={() => setActiveTab('skills')}
          >
            Skills Intelligence
          </button>
          <button 
            className={`py-3 px-4 rounded-2xl text-left transition-all font-medium ${activeTab === 'opportunities' ? 'bg-primary text-white shadow-md shadow-primary/30 hover-lift' : 'text-gray-600 hover:bg-white/60 hover:shadow-sm'}`}
            onClick={() => setActiveTab('opportunities')}
          >
            Opportunities
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto px-4 py-2">
        <header className="flex justify-between items-center mb-10 mt-6 glass rounded-3xl p-6 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back, Alex!</h1>
            <p className="text-gray-500 mt-1 font-medium">Here is your dynamic career intelligence briefing.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-xl shadow-md glow-effect cursor-pointer">
              A
            </div>
          </div>
        </header>

        {/* Dashboard Widgets */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="glass rounded-3xl p-8 card-shadow hover-lift">
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Career Match</h3>
            <div className="text-3xl font-extrabold text-gray-900 tracking-tight">{profile?.career_match || 'Undecided'}</div>
            <p className="text-green-500 text-sm mt-3 font-semibold bg-green-50 inline-block px-3 py-1 rounded-full">{profile?.match_score || 0}% Compatibility</p>
          </div>
          <div className="glass rounded-3xl p-8 card-shadow hover-lift">
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Skill Progress</h3>
            <div className="text-3xl font-extrabold text-gray-900 tracking-tight truncate">{Object.keys(profile?.skill_progress || {})[0] || 'No Skills Yet'}</div>
            <div className="w-full bg-gray-200/50 rounded-full h-3 mt-5 overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary-light h-3 rounded-full relative" style={{ width: `${Object.values(profile?.skill_progress || {})[0] || 0}%` }}>
                <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="glass rounded-3xl p-8 card-shadow hover-lift">
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Next Milestone</h3>
            <div className="text-2xl font-extrabold text-gray-900 leading-tight">{profile?.next_milestone || 'None'}</div>
            <button className="text-primary text-sm mt-4 font-bold cursor-pointer hover:underline bg-primary/5 px-4 py-2 rounded-xl transition-colors hover:bg-primary/10">View Details &rarr;</button>
          </div>
        </div>

        {/* Recent Recommendations */}
        <div className="glass rounded-3xl p-8 card-shadow flex-1 mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">AI Career Recommendations</h2>
          <div className="space-y-4">
            {profile?.recommendations?.map((rec: any, index: number) => (
              <div key={rec.id || index} className="flex items-center p-5 bg-white/50 border border-white/60 rounded-2xl hover-lift cursor-pointer transition-all">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary font-extrabold text-2xl mr-5 shadow-inner">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-lg">{rec.title}</h4>
                  <p className="text-gray-500 text-sm mt-1">{rec.reason}</p>
                </div>
                <button className="text-primary font-bold hover:underline text-sm bg-white shadow-sm px-5 py-2 rounded-xl border border-gray-100 hover:border-primary/20 transition-colors">Explore Path</button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* AI Assistant Side Panel */}
      <aside className="w-80 glass rounded-3xl flex flex-col p-6 shadow-sm relative overflow-hidden">
        {/* Subtle background glow for AI panel */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

        <div className="flex items-center gap-4 mb-8 relative z-10">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white shadow-md glow-effect">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="font-bold text-xl text-gray-900 tracking-tight">Guider AI</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto flex flex-col gap-4 relative z-10">
          <div className="bg-white/80 p-5 rounded-3xl rounded-tl-sm text-sm text-gray-700 shadow-sm border border-white">
            <span className="font-semibold block mb-1">Hi Alex! 👋</span>
            I noticed you completed the latest aptitude test. Your analytical skills have grown by 15%. Want to see how this affects your {profile?.career_match || 'career'} roadmap?
          </div>
        </div>

        <div className="mt-6 relative z-10">
          <input 
            type="text" 
            placeholder="Ask your AI mentor..." 
            className="w-full bg-white/60 border border-white/80 rounded-2xl py-4 pl-5 pr-14 text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all shadow-sm backdrop-blur-sm placeholder-gray-400 font-medium"
          />
          <button className="absolute right-2 top-2 h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors shadow-sm glow-effect">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
             </svg>
          </button>
        </div>
      </aside>
    </div>
  )
}

export default AppDashboard
