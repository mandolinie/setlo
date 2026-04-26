type Props = {
  label: React.ReactNode
  action?: React.ReactNode
}

export default function SectionHeader({ label, action }: Props) {
  return (
    <div className="flex justify-between items-center smalltext">
      <span>{label}</span>
      {action}
    </div>
  )
}