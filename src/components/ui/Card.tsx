import { forwardRef } from "react"

type Props = {
  children: React.ReactNode
  className?: string
  variant?: "default" | "ghost" | "dark"
} & React.HTMLAttributes<HTMLDivElement>

const Card = forwardRef<HTMLDivElement, Props>(
  (
    {
      children,
      className = "",
      variant = "default",
      style,
      ...rest
    },
    ref
  ) => {
    const base = "rounded-xl flex flex-col p-4 gap-2 text-center"

    const variants = {
      default: "bg-mist-800 shadow-md",
      ghost: "bg-transparent",
      dark: "bg-mist-900",
    }

    return (
      <div
        ref={ref}
        style={style}
        {...rest}
        className={`${base} ${variants[variant]} ${className}`}
      >
        {children}
      </div>
    )
  }
)

export default Card