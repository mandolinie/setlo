export const formatReps = (min: number, max: number): string => {
  return min === max ? `${min}` : `${min}-${max}`
}

export const formatExerciseTime = (seconds?: number): string => {
  if (seconds == null || isNaN(seconds)) return "0:00"

  const total = Math.max(0, Math.floor(seconds)) // guard against negatives/decimals

  const m = Math.floor(total / 60)
  const s = total % 60

  return `${m}:${String(s).padStart(2, "0")}`
}