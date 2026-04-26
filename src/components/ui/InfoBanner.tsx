import type { ReactNode } from "react"
import {
  IconInfoCircle,
  IconCircleCheck,
  IconAlertTriangle,
} from "@tabler/icons-react"

type Variant = "info" | "success" | "warning" | "error"

type InfoBannerProps = {
  variant?: Variant
  children: ReactNode
}

const variantStyles: Record<Variant, string> = {
  info: "border-blue-500/40 bg-blue-500/20 text-blue-300",
  success: "border-green-500/40 bg-green-500/20 text-green-300",
  warning: "border-yellow-500/40 bg-yellow-500/20 text-yellow-300",
  error: "border-red-500/40 bg-red-500/20 text-red-300",
}

const variantIcons: Record<Variant, ReactNode> = {
  info: <IconInfoCircle size={16} aria-hidden="true" />,
  success: <IconCircleCheck size={16} aria-hidden="true" />,
  warning: <IconAlertTriangle size={16} aria-hidden="true" />,
  error: <IconAlertTriangle size={16} aria-hidden="true" />,
}

export default function InfoBanner({
  variant = "info",
  children,
}: InfoBannerProps) {
  return (
    <div
      role="status"
      className={`flex items-start gap-2 rounded-md border py-2 px-3 text-sm ${variantStyles[variant]}`}
    >
      <div className="h-full flex items-center">{variantIcons[variant]}</div>
      <div>{children}</div>
    </div>
  )
}