import type { ButtonHTMLAttributes } from "react"

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> & {
  children: React.ReactNode
  ariaLabel: string
  className?: string
}

export default function IconButton({
  children,
  ariaLabel,
  className = "",
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      aria-label={ariaLabel}
      className={`rounded-full p-3 -m-3
        text-mist-400 interactive ${className}`}
    >
      {children}
    </button>
  )
}