import type { Exercise } from "../types/exercise"
import type { Routine } from "../types/routine"

export const defaultRoutines: Routine[] = [
  {
    id: "upper-body",
    name: "Upper Body",
    order: 0,
  },
  {
    id: "leg-day",
    name: "Leg Day",
    order: 1,
  },
]

export const defaultExercises: Partial<Exercise>[] = [
  // Upper Body
  {
    id: "push-ups",
    name: "Push-Ups",
    type: "reps",
    minReps: 10,
    maxReps: 15,
    totalSets: 3,
    order: 0,
    routineIds: ["upper-body"],
  },
  {
    id: "pull-ups",
    name: "Pull-Ups",
    type: "reps",
    minReps: 5,
    maxReps: 8,
    totalSets: 3,
    order: 1,
    routineIds: ["upper-body"],
    notes: "60s rest",
  },
  {
    id: "dips",
    name: "Dips",
    type: "reps",
    minReps: 8,
    maxReps: 12,
    totalSets: 3,
    order: 2,
    routineIds: ["upper-body"],
  },
  // Shared
  {
    id: "plank",
    name: "Plank",
    type: "time",
    time: 45,
    totalSets: 3,
    order: 3,
    routineIds: ["upper-body", "leg-day"],
    notes: "60s rest",
  },
  // Leg Day
  {
    id: "squats",
    name: "Squats",
    type: "reps",
    minReps: 12,
    maxReps: 15,
    totalSets: 4,
    order: 4,
    routineIds: ["leg-day"],
  },
  {
    id: "lunges",
    name: "Lunges",
    type: "reps",
    minReps: 10,
    maxReps: 12,
    totalSets: 3,
    order: 5,
    routineIds: ["leg-day"],
    notes: "Each leg",
  },
  {
    id: "wall-sit",
    name: "Wall Sit",
    type: "time",
    time: 60,
    totalSets: 3,
    order: 6,
    routineIds: ["leg-day"],
  },
]
