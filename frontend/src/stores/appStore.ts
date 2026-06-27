import { create } from 'zustand'

interface AppState {
  user: { phone: string; token: string } | null
  setUser: (user: { phone: string; token: string } | null) => void
  activeTool: string
  setActiveTool: (tool: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  activeTool: 'ai-detail-page',
  setActiveTool: (tool) => set({ activeTool: tool }),
}))
