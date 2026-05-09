import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type PomodoroPhase = 'idle' | 'focus' | 'break' | 'long-break'
export type CatMood = 'waiting' | 'eating' | 'playing' | 'sleeping' | 'cuddly' | 'unhappy' | 'grabbed' | 'landing'

export interface Encounter {
  id: string
  title: string
  description: string
  emoji: string
  affectionBonus: number
}

export const ENCOUNTERS: Encounter[] = [
  { id: 'gift', title: '猫咪送礼物', description: '小猫叼来一片叶子放在你面前 🍃', emoji: '🎁', affectionBonus: 5 },
  { id: 'keyboard', title: '踩键盘', description: '小猫踩上键盘打出一串乱码 asdfjkl;', emoji: '⌨️', affectionBonus: 3 },
  { id: 'belly', title: '翻肚皮', description: '小猫翻出软软的肚皮让你摸～', emoji: '🫶', affectionBonus: 8 },
  { id: 'tail', title: '追尾巴', description: '小猫转圈追自己的尾巴，转得晕乎乎的', emoji: '🌀', affectionBonus: 4 },
  { id: 'yawn', title: '打哈欠传染', description: '小猫打了个大哈欠，你也忍不住打了一个～', emoji: '🥱', affectionBonus: 6 },
  { id: 'knead', title: '踩奶', description: '小猫在你腿上踩奶，发出咕噜咕噜的声音', emoji: '💖', affectionBonus: 10 },
  { id: 'bird', title: '窗边看鸟', description: '小猫蹲在窗边专注地看外面的小鸟，嘴巴咔咔响', emoji: '🐦', affectionBonus: 5 },
  { id: 'box', title: '纸箱探险', description: '小猫钻进纸箱只露出尾巴，若是我能钻进去就一定能钻进去！', emoji: '📦', affectionBonus: 7 },
]

interface AppState {
  phase: PomodoroPhase
  timeRemaining: number
  totalTime: number
  currentRound: number
  isPaused: boolean
  affection: number
  catMood: CatMood
  catPosition: { x: number; y: number }
  isDragging: boolean
  activeEncounter: Encounter | null
  settings: {
    focusDuration: number
    shortBreakDuration: number
    longBreakDuration: number
    longBreakInterval: number
    soundEnabled: boolean
    notificationEnabled: boolean
  }
  lastLoginDate: string
  lastAffectionDecayTime: number

  startFocus: () => void
  startBreak: () => void
  skipPhase: () => void
  togglePause: () => void
  tick: () => void
  setAffection: (delta: number) => void
  setCatMood: (mood: CatMood) => void
  setCatPosition: (pos: { x: number; y: number }) => void
  setIsDragging: (dragging: boolean) => void
  triggerEncounter: () => void
  dismissEncounter: () => void
  updateSettings: (settings: Partial<AppState['settings']>) => void
  checkDailyLogin: () => void
  checkAffectionDecay: () => void
}

const DEFAULT_SETTINGS = {
  focusDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  longBreakInterval: 4,
  soundEnabled: true,
  notificationEnabled: true,
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      phase: 'idle',
      timeRemaining: DEFAULT_SETTINGS.focusDuration,
      totalTime: DEFAULT_SETTINGS.focusDuration,
      currentRound: 0,
      isPaused: false,
      affection: 50,
      catMood: 'waiting',
      catPosition: { x: 0, y: 0 },
      isDragging: false,
      activeEncounter: null,
      settings: DEFAULT_SETTINGS,
      lastLoginDate: '',
      lastAffectionDecayTime: Date.now(),

      startFocus: () => {
        const { settings } = get()
        set({
          phase: 'focus',
          timeRemaining: settings.focusDuration,
          totalTime: settings.focusDuration,
          isPaused: false,
          catMood: 'eating',
        })
      },

      startBreak: () => {
        const { settings, currentRound } = get()
        const isLongBreak = currentRound > 0 && currentRound % settings.longBreakInterval === 0
        const duration = isLongBreak ? settings.longBreakDuration : settings.shortBreakDuration
        set({
          phase: isLongBreak ? 'long-break' : 'break',
          timeRemaining: duration,
          totalTime: duration,
          isPaused: false,
          catMood: 'playing',
        })
      },

      skipPhase: () => {
        const { phase } = get()
        if (phase === 'focus') {
          get().startBreak()
        } else if (phase === 'break' || phase === 'long-break') {
          set({
            phase: 'idle',
            timeRemaining: get().settings.focusDuration,
            totalTime: get().settings.focusDuration,
            isPaused: false,
            catMood: get().affection >= 60 ? 'cuddly' : get().affection < 30 ? 'unhappy' : 'waiting',
          })
        }
      },

      togglePause: () => {
        set((s) => ({ isPaused: !s.isPaused }))
      },

      tick: () => {
        const { timeRemaining, isPaused, phase, settings, affection } = get()
        if (isPaused || phase === 'idle') return

        if (timeRemaining <= 1) {
          if (phase === 'focus') {
            const newRound = get().currentRound + 1
            const newAffection = Math.min(100, affection + 8)
            set({ currentRound: newRound, affection: newAffection })
            get().startBreak()
          } else {
            const newAffection = Math.min(100, affection + 5)
            set({
              phase: 'idle',
              timeRemaining: settings.focusDuration,
              totalTime: settings.focusDuration,
              isPaused: false,
              affection: newAffection,
              currentRound: phase === 'long-break' ? 0 : get().currentRound,
              catMood: newAffection >= 60 ? 'cuddly' : newAffection < 30 ? 'unhappy' : 'waiting',
            })
          }
        } else {
          set({ timeRemaining: timeRemaining - 1 })
        }
      },

      setAffection: (delta: number) => {
        set((s) => ({
          affection: Math.max(0, Math.min(100, s.affection + delta)),
        }))
      },

      setCatMood: (mood: CatMood) => set({ catMood: mood }),

      setCatPosition: (pos: { x: number; y: number }) => set({ catPosition: pos }),

      setIsDragging: (dragging: boolean) => set({ isDragging: dragging }),

      triggerEncounter: () => {
        const { affection } = get()
        if (affection < 60) return
        if (Math.random() > 0.3) return
        const encounter = ENCOUNTERS[Math.floor(Math.random() * ENCOUNTERS.length)]
        set((s) => ({
          activeEncounter: encounter,
          affection: Math.min(100, s.affection + encounter.affectionBonus),
        }))
      },

      dismissEncounter: () => set({ activeEncounter: null }),

      updateSettings: (newSettings: Partial<AppState['settings']>) => {
        set((s) => {
          const updated = { ...s.settings, ...newSettings }
          if (s.phase === 'idle') {
            return {
              settings: updated,
              timeRemaining: updated.focusDuration,
              totalTime: updated.focusDuration,
            }
          }
          return { settings: updated }
        })
      },

      checkDailyLogin: () => {
        const today = new Date().toDateString()
        const { lastLoginDate } = get()
        if (lastLoginDate !== today) {
          set((s) => ({
            lastLoginDate: today,
            affection: Math.min(100, s.affection + 5),
          }))
        }
      },

      checkAffectionDecay: () => {
        const { lastAffectionDecayTime, phase, affection } = get()
        const now = Date.now()
        const hourMs = 3600000
        if (now - lastAffectionDecayTime >= hourMs) {
          const isWorkHour = isWorkTime()
          if (isWorkHour && phase === 'idle') {
            set((s) => ({
              affection: Math.max(0, s.affection - 1),
              lastAffectionDecayTime: now,
              catMood: s.affection - 1 < 30 ? 'unhappy' : s.catMood,
            }))
          } else {
            set({ lastAffectionDecayTime: now })
          }
        }
      },
    }),
    {
      name: 'cat-pomodoro-storage',
      partialize: (state) => ({
        affection: state.affection,
        settings: state.settings,
        currentRound: state.currentRound,
        lastLoginDate: state.lastLoginDate,
        lastAffectionDecayTime: state.lastAffectionDecayTime,
        catPosition: state.catPosition,
      }),
    }
  )
)

export function isWorkTime(): boolean {
  const now = new Date()
  const day = now.getDay()
  if (day === 0 || day === 6) return false
  const hour = now.getHours()
  return hour >= 9 && hour < 18
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}
