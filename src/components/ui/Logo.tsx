import Mark from "../../assets/logo/setlo-lettermark.svg?react"
import Wordmark from "../../assets/logo/setlo-wordmark.svg?react"

type Props = {
  variant?: "mark" | "wordmark"
  size?: "sm" | "md" | "lg"
  className?: string
} & React.SVGProps<SVGSVGElement>

export default function Logo({
  variant = "mark",
  size = "md",
  className = "",
  ...props
}: Props) {
  const sizeMap = {
    sm: "h-4",
    md: "h-6",
    lg: "h-8",
  }

  const sizeClass = sizeMap[size]
  const baseClass = `${sizeClass} w-auto ${className}`

  if (variant === "wordmark") {
    return <Wordmark className={baseClass} {...props} />
  }

  return <Mark className={baseClass} {...props} />
}