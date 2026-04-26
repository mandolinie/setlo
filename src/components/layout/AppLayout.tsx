import Header from "./Header"

type Props = {
  children: React.ReactNode
  footer?: React.ReactNode
}

export default function AppLayout({ children, footer }: Props) {
  return (
    <div className="mainbg">
      <Header />

      {/* Content */}
      <div className="flex flex-col flex-1">
        {children}
      </div>

      {/* Footer (optional) */}
      {footer}
    </div>
  )
}