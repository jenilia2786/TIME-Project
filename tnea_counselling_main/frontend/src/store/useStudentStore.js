import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

const API_BASE = import.meta.env.VITE_API_URL || ''

/* ── Silent Backend Sync ─────────────────────────────────────── */
// Fire-and-forget: push profile to backend. Does NOT block UI.
const syncProfileToBackend = (profileId, mobile, student, completion) => {
  if (!profileId || !mobile) return
  fetch(`${API_BASE}/profile/upsert`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      profile_id: profileId,
      user_mobile: mobile,
      name: student.name || 'Student',
      relation: student.role === 'parent' ? 'self' : 'self',
      standard: student.standard || null,
      board: student.board || null,
      district: student.district || null,
      school: student.school || null,
      community: student.community || null,
      dob: student.dob || null,
      maths: parseFloat(student.maths) || null,
      physics: parseFloat(student.physics) || null,
      chemistry: parseFloat(student.chemistry) || null,
      interests: student.interests || [],
      career_goals: student.careerGoals || [],
      strong_subjects: student.strongSubjects || [],
      weak_subjects: student.weakSubjects || [],
      preferred_location: student.preferredLocation || null,
      hostel_required: student.hostelRequired || null,
      budget: student.budget || null,
      institution_type_pref: student.institutionTypePref || null,
      study_abroad: student.studyAbroad || null,
      profile_completion: completion || 10,
    })
  }).catch(() => {}) // silently fail if backend is offline
}

/* helpers */
const generateStudentAccessId = () => {
  const num = Math.floor(100000 + Math.random() * 900000)
  return `TNEDU-${new Date().getFullYear()}-${num}`
}

const computeCompletion = (student, quiz) => {
  let score = 10
  if (student.standard) score += 10
  if (student.board) score += 5
  if (student.district) score += 5
  if (student.dob) score += 5
  if (student.interests?.length > 0) score += 15
  if (student.careerGoals?.length > 0) score += 10
  if (student.strongSubjects?.length > 0) score += 10
  if (student.lifestyle) score += 10
  if (quiz?.completed) score += 20
  return Math.min(score, 100)
}

const initialStudent = {
  name: '',
  mobile: '',
  dob: '',
  standard: '',
  board: '',
  district: '',
  school: '',
  community: '',          // OC | BC | MBC | SC | SCA | ST — required by backend /recommend & /chat
  maths: '',              // Raw mark out of 100 — used in TNEA cutoff formula
  physics: '',            // Raw mark out of 100
  chemistry: '',          // Raw mark out of 100
  interests: [],
  careerGoals: [],
  strongSubjects: [],
  weakSubjects: [],
  preferredLocation: '',
  hostelRequired: '',
  budget: '',
  institutionTypePref: '',
  studyAbroad: '',
  favouriteSubject: '',
  subjectConfidence: {},
  lifestyle: null,
  avatar: '🎓',
  role: 'student', // 'student' | 'parent'
  loginName: '',
}

const initialQuiz = {
  completed: false,
  answers: {},
  results: null,
}

const useStudentStore = create(
  persist(
    (set, get) => ({
      sessionId: null,
      recoveryId: null,
      lastVisitedPath: '/dashboard',
      onboardingDone: false,
      dismissedProfileNudge: false,
      student: initialStudent,
      quiz: initialQuiz,
      profileCompletion: 0,
      computedCutoff: 0,     // TNEA formula: maths + (physics/2) + (chemistry/2), max 200
      notificationsOpen: false,
      recentColleges: [],
      recentCourses: [],
      selectedCareerOption: null,

      /* Wishlist Sections */
      wishlistCareers: [],   // { id, name, domain, desc }
      wishlistExams: [],     // { id, name, date, link }
      wishlistScholarships: [], // { id, name, amount, desc }
      /* College wishlist is managed by choiceService (backend) */

      /* Page first-visit flags for onboarding popups */
      seenPages: {},
      profiles: [],
      activeProfileId: null,

      /* AI Assistant & Tutorial */
      isAiAssistantOpen: false,
      hasSeenGenericTutorial: false,
      hasSeenPersonalizedTutorial: false,
      aiMessages: [
        { role: 'ai', text: 'Hello! I am your AI Career Mentor. You can ask me anything about college admissions, career paths, or scholarship opportunities in Tamil Nadu.', id: 'welcome' }
      ],

      /* Session */
      startSession: (name, mobile, role = 'student') => {
        const profileId = uuidv4();
        const studentObj = { ...initialStudent, name, mobile, role, loginName: name };
        return set({
          sessionId: uuidv4(),
          recoveryId: generateStudentAccessId(),
          student: studentObj,
          profileCompletion: 10,
          onboardingDone: false,
          hasSeenGenericTutorial: false,
          hasSeenPersonalizedTutorial: false,
          profiles: [{ id: profileId, name: name, relation: role === 'student' ? 'self' : 'child', createdAt: new Date().toISOString(), data: studentObj, profileCompletion: 10 }],
          activeProfileId: profileId,
          aiMessages: [{ role: 'ai', text: `Hello ${name}! I am your AI Career Mentor. You can ask me anything about college admissions, career paths, or scholarship opportunities in Tamil Nadu.`, id: 'welcome' }]
        })
      },

      restoreSession: (recoveryId) =>
        set({
          sessionId: uuidv4(),
          recoveryId,
          lastVisitedPath: '/dashboard',
        }),

      /* Profile */
      updateStudentProfile: (updates) =>
        set((state) => {
          const student = { ...state.student, ...updates }
          const completion = computeCompletion(student, state.quiz)
          
          const profiles = state.profiles.map(p => 
             p.id === state.activeProfileId 
               ? { ...p, name: student.name, standard: student.standard, domain: student.interests?.[0] || p.domain, data: student, profileCompletion: completion } 
               : p
          )
          
          // Silently sync to backend (fire and forget)
          syncProfileToBackend(state.activeProfileId, state.student.mobile, student, completion)
          
          return {
            student,
            profiles,
            profileCompletion: completion,
          }
        }),

      /**
       * Update subject marks and auto-compute TNEA cutoff.
       * Formula: maths + (physics / 2) + (chemistry / 2)  → max 200
       */
      updateMarks: (maths, physics, chemistry) =>
        set((state) => {
          const m = parseFloat(maths) || 0
          const p = parseFloat(physics) || 0
          const c = parseFloat(chemistry) || 0
          const cutoff = Math.min(200, Math.max(0, m + p / 2 + c / 2))
          const student = { ...state.student, maths, physics, chemistry }
          const completion = computeCompletion(student, state.quiz)
          
          const profiles = state.profiles.map(p => 
             p.id === state.activeProfileId 
               ? { ...p, data: student, profileCompletion: completion } 
               : p
          )

          // Silently sync to backend
          syncProfileToBackend(state.activeProfileId, state.student.mobile, { ...student, computedCutoff: parseFloat(cutoff.toFixed(2)) }, completion)

          return {
            student,
            profiles,
            computedCutoff: parseFloat(cutoff.toFixed(2)),
            profileCompletion: completion,
          }
        }),

      completeOnboarding: () =>
        set((state) => ({
          onboardingDone: true,
          profileCompletion: computeCompletion(state.student, state.quiz),
        })),

      /* Multi-Profile Actions */
      addProfile: (profile) =>
        set((state) => {
          const newProfile = {
            id: uuidv4(),
            name: profile.name || 'Student',
            standard: profile.standard || '',
            domain: profile.domain || '',
            avatar: profile.avatar || '🎓',
            relation: profile.relation || 'self',
            createdAt: new Date().toISOString(),
            ...profile,
            data: { ...initialStudent, name: profile.name || 'Student', mobile: state.student.mobile, role: state.student.role, loginName: state.student.loginName },
            profileCompletion: 10
          }
          return {
            profiles: [...state.profiles, newProfile],
            activeProfileId: state.activeProfileId || newProfile.id,
          }
        }),

      removeProfile: (profileId) =>
        set((state) => {
          const profiles = state.profiles.filter((p) => p.id !== profileId)
          const activeProfileId =
            state.activeProfileId === profileId
              ? profiles[0]?.id || null
              : state.activeProfileId
              
          let nextState = { profiles, activeProfileId }
          if (state.activeProfileId === profileId && activeProfileId) {
             const newProfile = profiles.find(p => p.id === activeProfileId);
             nextState.student = { 
               ...(newProfile?.data || initialStudent), 
               name: newProfile?.name || 'Student', 
               mobile: state.student.mobile, 
               role: state.student.role, 
               loginName: state.student.loginName 
             };
             nextState.profileCompletion = newProfile?.profileCompletion || 10;
          }
          return nextState
        }),

      switchProfile: (profileId) =>
        set((state) => {
          if (state.activeProfileId === profileId) return {};
          
          // Save current student state into the active profile
          const updatedProfiles = state.profiles.map(p => 
            p.id === state.activeProfileId ? { ...p, data: state.student, profileCompletion: state.profileCompletion } : p
          );
          
          const newProfile = updatedProfiles.find(p => p.id === profileId);
          
          return {
            activeProfileId: profileId,
            profiles: updatedProfiles,
            student: { 
              ...(newProfile?.data || initialStudent), 
              name: newProfile?.name || 'Student', 
              mobile: state.student.mobile, 
              role: state.student.role, 
              loginName: state.student.loginName 
            },
            profileCompletion: newProfile?.profileCompletion || 10
          }
        }),

      updateProfile: (profileId, updates) =>
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === profileId ? { ...p, ...updates } : p
          ),
        })),

      getActiveProfile: () => {
        const state = get()
        return state.profiles.find((p) => p.id === state.activeProfileId) || null
      },

      /* Quiz */
      saveQuizAnswer: (questionId, value) =>
        set((state) => {
          const answers = { ...state.quiz.answers, [questionId]: value }
          return { quiz: { ...state.quiz, answers } }
        }),

      completeQuiz: (results) =>
        set((state) => {
          const quiz = { ...state.quiz, completed: true, results }
          return {
            quiz,
            profileCompletion: computeCompletion(state.student, quiz),
          }
        }),

      /* Navigation */
      setLastVisitedPath: (path) => set({ lastVisitedPath: path }),

      /* Notifications */
      toggleNotifications: () =>
        set((s) => ({ notificationsOpen: !s.notificationsOpen })),

      /* Recent items */
      addRecentCollege: (id) =>
        set((s) => ({
          recentColleges: [id, ...s.recentColleges.filter((x) => x !== id)].slice(0, 10),
        })),

      addRecentCourse: (id) =>
        set((s) => ({
          recentCourses: [id, ...s.recentCourses.filter((x) => x !== id)].slice(0, 10),
        })),

      setSelectedCareerOption: (option) => set({ selectedCareerOption: option }),

      /* Wishlist Actions */
      addToWishlist: (section, item) =>
        set((s) => {
          const key = `wishlist${section.charAt(0).toUpperCase() + section.slice(1)}`
          const current = s[key] || []
          if (current.find(c => c.id === item.id)) return {} // already exists
          return { [key]: [...current, { ...item, addedAt: new Date().toISOString() }] }
        }),

      removeFromWishlist: (section, id) =>
        set((s) => {
          const key = `wishlist${section.charAt(0).toUpperCase() + section.slice(1)}`
          return { [key]: (s[key] || []).filter(c => c.id !== id) }
        }),

      markPageSeen: (page) =>
        set((s) => ({ seenPages: { ...s.seenPages, [page]: true } })),
      toggleAiAssistant: (isOpen) =>
        set((s) => ({ isAiAssistantOpen: isOpen !== undefined ? isOpen : !s.isAiAssistantOpen })),
        
      addAiMessage: (msg) =>
        set((s) => ({ aiMessages: [...s.aiMessages, { ...msg, id: uuidv4() }] })),

      clearAiMessages: () =>
        set((s) => ({ aiMessages: [{ role: 'ai', text: `Hello ${s.student.loginName || 'there'}! I am your AI Career Mentor. You can ask me anything about college admissions, career paths, or scholarship opportunities in Tamil Nadu.`, id: 'welcome' }] })),

      /* Tutorial Actions */
      completeGenericTutorial: () => set({ hasSeenGenericTutorial: true }),
      completePersonalizedTutorial: () => set({ hasSeenPersonalizedTutorial: true }),

      /* Profile Nudge */
      dismissProfileNudge: () => set({ dismissedProfileNudge: true }),

      /* Reset */
      clearSession: () =>
        set({
          sessionId: null,
          recoveryId: null,
          lastVisitedPath: '/',
          onboardingDone: false,
          student: initialStudent,
          quiz: initialQuiz,
          profileCompletion: 0,
          computedCutoff: 0,
          recentColleges: [],
          recentCourses: [],
          isAiAssistantOpen: false,
          hasSeenGenericTutorial: false,
          hasSeenPersonalizedTutorial: false,
          dismissedProfileNudge: false,
          profiles: [],
          activeProfileId: null,
          aiMessages: [{ role: 'ai', text: 'Hello there! I am your AI Career Mentor. You can ask me anything about college admissions, career paths, or scholarship opportunities in Tamil Nadu.', id: 'welcome' }],
        }),
    }),
    {
      name: 'tnea-student-session',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useStudentStore
