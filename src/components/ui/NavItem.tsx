import { Link } from "react-router-dom"

type Props = {
  to: string
  label?: string
  ariaLabel?: string
  icon?: React.ReactNode
  active?: boolean
  onClick?: () => void
  variant?: "tab" | "icon"
}

export default function NavItem({
  to,
  label,
  ariaLabel,
  icon,
  active,
  onClick,
  variant = "tab",
}: Props) {
  const base =
    "uppercase font-medium text-base flex items-center justify-center gap-2 p-3 interactive"

  const tabLayout = "flex-1"
  const iconLayout = "shrink-0"

  const activeClass = "text-mist-50 bg-mist-900"
  const inactiveClass = "text-mist-400"

  return (
    <Link
      to={to}
      onClick={onClick}
      aria-label={ariaLabel ?? label}
      aria-current={active ? "page" : undefined}
      className={`
        ${base}
        ${variant === "tab" ? tabLayout : iconLayout}
        ${active ? activeClass : inactiveClass}
      `}
    >
      {icon}
      {variant !== "icon" && label && <span>{label}</span>}
    </Link>
  )
}