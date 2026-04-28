import { create } from "zustand"
import { load, save } from "../utils/storage"
import { generateId } from "../utils/id"

const HISTORY_KEY = "history"

export type WorkoutLog = {
  id: string
  date: string           // ISO date string, e.g. "2026-04-28"
  routineName: string
  completedSets: number  // actual sets done, may exceed plannedSets if user overshoots
  plannedSets: number
}

type HistoryState = {
  logs: WorkoutLog[]
  addLog: (entry: Omit<WorkoutLog, "id">) => void
  deleteLog: (id: string) => void
}

const initialLogs = load<WorkoutLog[]>(HISTORY_KEY, [])

export const useHistoryStore = create<HistoryState>((set) => ({
  logs: initialLogs,

  addLog: (entry) => {
    set((state) => {
      const logs = [{ ...entry, id: generateId() }, ...state.logs]
      save(HISTORY_KEY, logs)
      return { logs }
    })
  },

  deleteLog: (id) => {
    set((state) => {
      const logs = state.logs.filter((l) => l.id !== id)
      save(HISTORY_KEY, logs)
      return { logs }
    })
  },
}))
