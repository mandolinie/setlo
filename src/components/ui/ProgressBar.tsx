type Props = {
  value: number // 0 → 1
}

export default function ProgressBar({ value }: Props) {
  const clamped = Math.min(1, Math.max(0, value))
  const percentage = clamped * 100

  // --- COLOR STEPS ---
  const getColor = () => {
    if (clamped === 1) return "bg-green-500"
    if (clamped >= 0.75) return "bg-lime-500"
    if (clamped >= 0.50) return "bg-yellow-500"
    if (clamped >= 0.24) return "bg-amber-500"
    return "bg-orange-500"
  }

  return (
    <div className="w-full h-3 bg-mist-700 rounded-full overflow-hidden">
      <div
        className={`h-full transition-all duration-200 ${getColor()}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}