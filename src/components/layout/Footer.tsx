import { useLocation } from "react-router-dom"
import Logo from "../ui/Logo"

type Props = {
  children?: React.ReactNode
}

export default function Footer({ children }: Props) {
  const { pathname } = useLocation()

  const year = new Date().getFullYear()

  const showCopyright =
    pathname === "/about" ||
    pathname === "/legal" ||
    pathname === "/privacy"

  return (
    <footer className={`px-4 py-6 flex flex-col gap-4 ${children ? "sticky bottom-0 bg-mist-900" : "mt-auto"}`}>

      {/* Primary actions */}
      {children}

      {/* Copyright */}
      {showCopyright && (
        <div className="flex items-center justify-center gap-2 text-xs text-mist-400">
          <Logo size="sm" aria-hidden="true" />
          <span>© {year} SETLØ. All rights reserved.</span>
        </div>
      )}
    </footer>
  )
}