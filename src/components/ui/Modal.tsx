import { useEffect, useRef } from "react"

type Props = {
  open: boolean
  onClose: () => void
  variant?: "fullscreen" | "dialog"
  ariaLabel?: string
  children: React.ReactNode
}

export default function Modal({
  open,
  onClose,
  variant = "dialog",
  ariaLabel,
  children,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  // ESC close
  useEffect(() => {
    if (!open) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [open, onClose])

  // focus trap
  useEffect(() => {
    if (!open) return

    const el = ref.current
    if (!el) return

    const selectors =
      'a, button, textarea, input, select, [tabindex]:not([tabindex="-1"])'

    const getFocusable = () =>
      Array.from(el.querySelectorAll<HTMLElement>(selectors)).filter(
        (el) => !el.hasAttribute("disabled")
      )

    const focusable = getFocusable()
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    // only focus if nothing inside is already focused
    if (!el.contains(document.activeElement)) {
      first.focus()
    }

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return

      const current = document.activeElement

      if (e.shiftKey) {
        if (current === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (current === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    el.addEventListener("keydown", handleTab)
    return () => el.removeEventListener("keydown", handleTab)
  }, [open])

  if (!open) return null

  const base =
    variant === "fullscreen"
      ? "modalbg"
      : "dialogbg"

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      className={base}
    >
      {children}
    </div>
  )
}