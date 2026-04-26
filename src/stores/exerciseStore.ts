import { create } from "zustand"
import type { Exercise } from "../types/exercise"
import type { Routine } from "../types/routine"
import { load, save } from "../utils/storage"
import { generateId } from "../utils/id"
import { defaultExercises, defaultRoutines } from "./defaultExercises"

export const ALL_ROUTINE_ID = "all"

const EXERCISES_KEY = "exercises"
const EXERCISES_LEGACY_KEY = "routine_exercises"
const ROUTINES_KEY = "routines"

/* ------------------ helpers ------------------ */

const normalizeOrder = (items: Exercise[]) =>
  items.map((e, i) => ({ ...e, order: i }))

const buildExercise = (
  input: Partial<Exercise>,
  index: number,
  fallbackRoutineId: string
): Exercise => {
  const base = {
    id: input.id ?? generateId(),
    name: input.name?.trim() || `Exercise ${index + 1}`,
    totalSets: input.totalSets ?? 3,
    order: input.order ?? index,
    routineIds: input.routineIds?.length ? input.routineIds : [fallbackRoutineId],
    ...(input.notes?.trim() ? { notes: input.notes.trim() } : {}),
  }

  if (input.type === "time") {
    return {
      ...base,
      type: "time" as const,
      time: input.time ?? 30,
    }
  }

  return {
    ...base,
    type: "reps" as const,
    minReps: input.minReps ?? 8,
    maxReps: input.maxReps ?? 12,
  }
}

/* ------------------ types ------------------ */

type ExerciseState = {
  exercises: Exercise[]
  routines: Routine[]
  activeRoutineId: string

  addExerciseSafe: (input: Partial<Exercise>) => void
  updateExerciseById: (id: string, updates: Partial<Exercise>) => void
  deleteExerciseSafe: (id: string) => void
  reorderExercises: (reorderedVisible: Exercise[]) => void

  addRoutine: (name: string) => void
  deleteRoutine: (id: string) => void
  setRoutines: (drafts: { id?: string; name: string }[]) => void
  setActiveRoutine: (id: string) => void

  getActiveRoutineExercises: () => Exercise[]
}

/* ------------------ store ------------------ */

export const useExerciseStore = create<ExerciseState>((set, get) => {
  // ---- initialize routines ----
  const storedRoutines = load<unknown[]>(ROUTINES_KEY, [])
  const initialRoutines: Routine[] =
    storedRoutines.length > 0
      ? (storedRoutines as Partial<Routine>[]).map((r, i) => ({
          id: r.id ?? generateId(),
          name: r.name?.trim() || `Routine ${i + 1}`,
          order: r.order ?? i,
        }))
      : defaultRoutines.map((r) => ({ ...r }))

  if (storedRoutines.length === 0) {
    save(ROUTINES_KEY, initialRoutines)
  }

  const firstRoutineId = initialRoutines[0].id

  // ---- initialize exercises (migrate from legacy key if needed) ----
  let rawExercises = load<unknown[]>(EXERCISES_KEY, [])
  if (rawExercises.length === 0) {
    rawExercises = load<unknown[]>(EXERCISES_LEGACY_KEY, [])
  }

  const isEmpty = rawExercises.length === 0
  const source = isEmpty ? defaultExercises : rawExercises

  const initialExercises = normalizeOrder(
    (source as Partial<Exercise>[]).map((e, i) =>
      buildExercise(e, i, firstRoutineId)
    )
  )

  if (isEmpty) {
    save(EXERCISES_KEY, initialExercises)
  }

  return {
    exercises: initialExercises,
    routines: initialRoutines,
    activeRoutineId: ALL_ROUTINE_ID,

    /* ---------- exercise actions ---------- */

    addExerciseSafe: (input) => {
      set((state) => {
        const fallbackId = state.routines[0]?.id ?? ""
        const defaultIds =
          state.activeRoutineId === ALL_ROUTINE_ID
            ? state.routines.map((r) => r.id)
            : [state.activeRoutineId]
        const routineIds = input.routineIds?.length ? input.routineIds : defaultIds

        const next = normalizeOrder([
          ...state.exercises,
          buildExercise(
            { ...input, routineIds },
            state.exercises.length,
            fallbackId
          ),
        ])

        save(EXERCISES_KEY, next)
        return { exercises: next }
      })
    },

    updateExerciseById: (id, updates) => {
      set((state) => {
        const updated = state.exercises.map((e) => {
          if (e.id !== id) return e

          const nextType = updates.type ?? e.type
          const notes =
            updates.notes !== undefined
              ? updates.notes.trim() || undefined
              : e.notes
          const routineIds = updates.routineIds ?? e.routineIds

          if (nextType === "time") {
            return {
              id: e.id,
              name: updates.name ?? e.name,
              totalSets: updates.totalSets ?? e.totalSets,
              order: e.order,
              routineIds,
              type: "time" as const,
              time:
                updates.type === "time"
                  ? updates.time ?? 30
                  : e.type === "time"
                  ? e.time
                  : 30,
              ...(notes ? { notes } : {}),
            }
          }

          return {
            id: e.id,
            name: updates.name ?? e.name,
            totalSets: updates.totalSets ?? e.totalSets,
            order: e.order,
            routineIds,
            type: "reps" as const,
            minReps:
              updates.type === "reps"
                ? updates.minReps ?? 8
                : e.type === "reps"
                ? e.minReps
                : 8,
            maxReps:
              updates.type === "reps"
                ? updates.maxReps ?? 12
                : e.type === "reps"
                ? e.maxReps
                : 12,
            ...(notes ? { notes } : {}),
          }
        })

        const normalized = normalizeOrder(updated)
        save(EXERCISES_KEY, normalized)
        return { exercises: normalized }
      })
    },

    deleteExerciseSafe: (id) => {
      set((state) => {
        const filtered = state.exercises.filter((e) => e.id !== id)
        const normalized = normalizeOrder(filtered)
        save(EXERCISES_KEY, normalized)
        return { exercises: normalized }
      })
    },

    // Accepts only the reordered visible (filtered) exercises.
    // Non-visible exercises are appended after, then the whole list is normalized.
    reorderExercises: (reorderedVisible) => {
      set((state) => {
        const visibleIds = new Set(reorderedVisible.map((e) => e.id))
        const others = state.exercises.filter((e) => !visibleIds.has(e.id))
        const normalized = normalizeOrder([...reorderedVisible, ...others])
        save(EXERCISES_KEY, normalized)
        return { exercises: normalized }
      })
    },

    /* ---------- routine actions ---------- */

    addRoutine: (name) => {
      set((state) => {
        const routine: Routine = {
          id: generateId(),
          name: name.trim(),
          order: state.routines.length,
        }
        const routines = [...state.routines, routine]
        save(ROUTINES_KEY, routines)
        return { routines, activeRoutineId: routine.id }
      })
    },

    deleteRoutine: (id) => {
      set((state) => {
        if (state.routines.length <= 1) return state

        const routines = state.routines
          .filter((r) => r.id !== id)
          .map((r, i) => ({ ...r, order: i }))

        const fallbackId = routines[0].id

        // Remove deleted id from exercises; fall back to first remaining routine
        const exercises = state.exercises.map((e) => {
          const routineIds = e.routineIds.filter((rid) => rid !== id)
          return {
            ...e,
            routineIds: routineIds.length > 0 ? routineIds : [fallbackId],
          }
        })

        save(ROUTINES_KEY, routines)
        save(EXERCISES_KEY, exercises)

        const activeRoutineId =
          state.activeRoutineId === id ? ALL_ROUTINE_ID : state.activeRoutineId

        return { routines, exercises, activeRoutineId }
      })
    },

    setRoutines: (drafts) => {
      set((state) => {
        const valid = drafts.filter((d) => d.name.trim())
        if (valid.length === 0) return state

        const newRoutines: Routine[] = valid.map((d, i) => ({
          id: d.id ?? generateId(),
          name: d.name.trim(),
          order: i,
        }))

        const newIds = new Set(newRoutines.map((r) => r.id))
        const deletedIds = state.routines
          .map((r) => r.id)
          .filter((id) => !newIds.has(id))

        const fallbackId = newRoutines[0].id

        const exercises =
          deletedIds.length > 0
            ? state.exercises.map((e) => {
                const routineIds = e.routineIds.filter(
                  (id) => !deletedIds.includes(id)
                )
                return {
                  ...e,
                  routineIds: routineIds.length > 0 ? routineIds : [fallbackId],
                }
              })
            : state.exercises

        const activeRoutineId =
          state.activeRoutineId === ALL_ROUTINE_ID || newIds.has(state.activeRoutineId)
            ? state.activeRoutineId
            : ALL_ROUTINE_ID

        save(ROUTINES_KEY, newRoutines)
        if (deletedIds.length > 0) save(EXERCISES_KEY, exercises)

        return { routines: newRoutines, exercises, activeRoutineId }
      })
    },

    setActiveRoutine: (id) => {
      set({ activeRoutineId: id })
    },

    /* ---------- derived ---------- */

    getActiveRoutineExercises: () => {
      const { exercises, activeRoutineId } = get()
      if (activeRoutineId === ALL_ROUTINE_ID)
        return [...exercises].sort((a, b) => a.order - b.order)
      return exercises
        .filter((e) => e.routineIds.includes(activeRoutineId))
        .sort((a, b) => a.order - b.order)
    },
  }
})
