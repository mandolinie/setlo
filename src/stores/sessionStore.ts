import { create } from "zustand"
import type { Exercise } from "../types/exercise"
import { useExerciseStore } from "./exerciseStore"
import { load, save } from "../utils/storage"

const SESSION_KEY = "session"

/* ------------------ types ------------------ */

type PersistedSession = {
  isActive: boolean
  exercises: Exercise[]
  setCounts: Record<string, number>
  currentExerciseId: string | null
  accumulatedTime: number
  isRunning: boolean
  startTime: number | null
}

type SessionState = {
  isActive: boolean

  exercises: Exercise[]
  setCounts: Record<string, number>
  currentExerciseId: string | null

  startTime: number | null
  accumulatedTime: number
  isRunning: boolean

  startWorkout: () => void
  resetWorkout: () => void

  nextExercise: () => void
  prevExercise: () => void

  incrementSet: () => void
  decrementSet: () => void
  resetSets: () => void

  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void

  getElapsedTime: () => number
}

/* ------------------ helpers ------------------ */

function persistSession(state: PersistedSession) {
  save(SESSION_KEY, state)
}

function clearSession() {
  save(SESSION_KEY, null)
}

/* ------------------ init from localStorage ------------------ */

const stored = load<PersistedSession | null>(SESSION_KEY, null)

let initialState: Pick<
  SessionState,
  | "isActive"
  | "exercises"
  | "setCounts"
  | "currentExerciseId"
  | "accumulatedTime"
  | "isRunning"
  | "startTime"
>

if (stored?.isActive) {
  // If the timer was running when the app was suspended, add the time elapsed
  // since the last save so the clock is accurate, then leave it paused.
  const restoredAccumulatedTime =
    stored.isRunning && stored.startTime
      ? stored.accumulatedTime + (Date.now() - stored.startTime)
      : stored.accumulatedTime

  initialState = {
    isActive: true,
    exercises: stored.exercises,
    setCounts: stored.setCounts,
    currentExerciseId: stored.currentExerciseId,
    accumulatedTime: restoredAccumulatedTime,
    isRunning: false,
    startTime: null,
  }
} else {
  initialState = {
    isActive: false,
    exercises: [],
    setCounts: {},
    currentExerciseId: null,
    accumulatedTime: 0,
    isRunning: false,
    startTime: null,
  }
}

/* ------------------ store ------------------ */

export const useSessionStore = create<SessionState>((set, get) => ({
  ...initialState,

  startWorkout: () => {
    const snapshot = structuredClone(
      useExerciseStore.getState().getActiveRoutineExercises()
    )

    const setCounts = Object.fromEntries(
      snapshot.map((e) => [e.id, 0])
    )

    const next: PersistedSession = {
      isActive: true,
      exercises: snapshot,
      setCounts,
      currentExerciseId: snapshot[0]?.id ?? null,
      accumulatedTime: 0,
      isRunning: false,
      startTime: null,
    }

    set(next)
    persistSession(next)
  },

  resetWorkout: () => {
    set({
      isActive: false,
      exercises: [],
      setCounts: {},
      currentExerciseId: null,
      startTime: null,
      accumulatedTime: 0,
      isRunning: false,
    })
    clearSession()
  },

  nextExercise: () => {
    const { exercises, currentExerciseId } = get()
    if (exercises.length === 0 || !currentExerciseId) return

    const index = exercises.findIndex((e) => e.id === currentExerciseId)
    const next = exercises[(index + 1) % exercises.length]

    set({ currentExerciseId: next.id })
    persistSession({ ...get(), currentExerciseId: next.id })
  },

  prevExercise: () => {
    const { exercises, currentExerciseId } = get()
    if (exercises.length === 0 || !currentExerciseId) return

    const index = exercises.findIndex((e) => e.id === currentExerciseId)
    const prev = exercises[(index - 1 + exercises.length) % exercises.length]

    set({ currentExerciseId: prev.id })
    persistSession({ ...get(), currentExerciseId: prev.id })
  },

  incrementSet: () => {
    const id = get().currentExerciseId
    if (!id) return

    set((state) => {
      const setCounts = { ...state.setCounts, [id]: state.setCounts[id] + 1 }
      persistSession({ ...state, setCounts })
      return { setCounts }
    })
  },

  decrementSet: () => {
    const id = get().currentExerciseId
    if (!id) return

    set((state) => {
      const setCounts = {
        ...state.setCounts,
        [id]: Math.max(0, state.setCounts[id] - 1),
      }
      persistSession({ ...state, setCounts })
      return { setCounts }
    })
  },

  resetSets: () => {
    const id = get().currentExerciseId
    if (!id) return

    set((state) => {
      const setCounts = { ...state.setCounts, [id]: 0 }
      persistSession({ ...state, setCounts })
      return { setCounts }
    })
  },

  startTimer: () => {
    if (get().isRunning) return

    const startTime = Date.now()
    set({ isRunning: true, startTime })
    persistSession({ ...get(), isRunning: true, startTime })
  },

  pauseTimer: () => {
    if (!get().isRunning) return

    const accumulatedTime = get().getElapsedTime()
    set({ isRunning: false, accumulatedTime, startTime: null })
    persistSession({ ...get(), isRunning: false, accumulatedTime, startTime: null })
  },

  resetTimer: () => {
    set({ isRunning: false, accumulatedTime: 0, startTime: null })
    persistSession({ ...get(), isRunning: false, accumulatedTime: 0, startTime: null })
  },

  getElapsedTime: () => {
    const { startTime, accumulatedTime, isRunning } = get()

    if (!isRunning || !startTime) return accumulatedTime

    return accumulatedTime + (Date.now() - startTime)
  },
}))
