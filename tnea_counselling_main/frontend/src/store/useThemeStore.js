import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setTheme: (theme) => set({ theme }),
      sidebarCollapsed: false,
      setSidebarCollapsed: (val) => set((state) => ({ sidebarCollapsed: typeof val === 'function' ? val(state.sidebarCollapsed) : val })),
    }),
    {
      name: 'theme-storage', // unique name
    }
  )
)

export default useThemeStore
