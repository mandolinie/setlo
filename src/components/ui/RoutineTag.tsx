import { IconCheck } from "@tabler/icons-react"

type Props = {
  label: string
  selected: boolean
  disabled?: boolean
  onClick: () => void
}

export default function RoutineTag({ label, selected, disabled = false, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={`flex items-center px-3 py-2 gap-2 rounded-md text-sm font-medium uppercase interactive
        ${selected
          ? "bg-mist-700 text-mist-50"
          : "bg-transparent text-mist-500"
        }
        ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer"}
      `}
    >
      {selected && <IconCheck size={16} aria-hidden="true" />}
      {label}
    </button>
  )
}
