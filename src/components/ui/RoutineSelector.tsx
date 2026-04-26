import { useState, useEffect, useRef } from "react"
import { IconChevronDown } from "@tabler/icons-react"
import { useExerciseStore, ALL_ROUTINE_ID } from "../../stores/exerciseStore"

type Props = {
  centered?: boolean
}

export default function RoutineSelector({ centered = false }: Props) {
  const { routines, activeRoutineId, setActiveRoutine } = useExerciseStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const activeLabel =
    activeRoutineId === ALL_ROUTINE_ID
      ? "All"
      : (routines.find((r) => r.id === activeRoutineId)?.name ?? "—")

  // Close on outside click
  useEffect(() => {
    if (!open) return

    const handlePointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [open])

  // Close on ESC
  useEffect(() => {
    if (!open) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex items-center px-3 py-2 gap-2 rounded-md text-lg font-semibold uppercase interactive
          ${centered ? "justify-center bg-mist-700" : ""}`}
      >
        {activeLabel}
        <IconChevronDown
          size={20}
          aria-hidden="true"
          className={`transition-transform duration-100 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select routine"
          className={`absolute top-full p-3 min-w-3xs bg-mist-800 rounded-xl shadow-2xl overflow-hidden z-30
            ${centered ? "left-1/2 -translate-x-1/2" : "left-0"}`}
        >
          {[{ id: ALL_ROUTINE_ID, name: "All" }, ...routines].map((routine) => (
            <button
              key={routine.id}
              role="option"
              aria-selected={routine.id === activeRoutineId}
              onClick={() => {
                setActiveRoutine(routine.id)
                setOpen(false)
              }}
              className={`w-full p-3 rounded-md text-base font-medium uppercase interactive
                ${centered ? "text-center" : "text-left"}
                ${routine.id === activeRoutineId
                  ? "text-green-400"
                  : "text-mist-200"
                }`}
            >
              {routine.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
