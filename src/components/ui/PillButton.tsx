type Props = {
  children: React.ReactNode
  onClick?: () => void
  variant?: "default" | "success" | "error"
  fullWidth?: boolean
  fit?: boolean
  disabled?: boolean
  className?: string
}

export default function PillButton({
  children,
  onClick,
  variant = "default",
  fullWidth = false,
  fit = false,
  disabled = false,
  className = "",
}: Props) {
  const base =
    "rounded-full font-semibold text-base text-center uppercase flex items-center justify-center p-3 gap-2 interactive"

  const variants = {
    default: "bg-mist-700",
    success: "bg-green-700",
    error: "bg-red-700",
  }

  const widthClass = fit
    ? "w-auto"
    : fullWidth
    ? "w-full"
    : "flex-1"

  const interaction = disabled
    ? "opacity-50 cursor-not-allowed pointer-events-none"
    : "interactive"

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${widthClass} ${interaction} ${className}`}
    >
      {children}
    </button>
  )
}