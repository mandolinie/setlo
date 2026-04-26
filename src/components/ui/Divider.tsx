type Props = {
  className?: string
}

export default function Divider({ className = "" }: Props) {
  return (
    <div
      className={`w-full h-px bg-mist-800 ${className}`}
    />
  )
}