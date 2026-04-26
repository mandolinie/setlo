type BaseExercise = {
  id: string
  name: string
  totalSets: number
  order: number
  routineIds: string[]
  notes?: string
}

export type Exercise =
  | (BaseExercise & {
      type: "reps"
      minReps: number
      maxReps: number
      time?: never
    })
  | (BaseExercise & {
      type: "time"
      time: number
      minReps?: never
      maxReps?: never
    })