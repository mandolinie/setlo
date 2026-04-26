import { useLocation } from "react-router-dom"
import {
  IconBarbellFilled,
  IconListCheckFilled,
  IconMenu2,
  IconFileText,
  IconShield,
  IconX,
} from "@tabler/icons-react"
import { useState } from "react"

import IconButton from "../ui/IconButton"
import Logo from "../ui/Logo"
import NavItem from "../ui/NavItem"

export default function Header() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  const isWorkout = pathname === "/workout"
  const isRoutine = pathname === "/routine"
  const isLegal = pathname === "/legal"
  const isPrivacy = pathname === "/privacy"

  return (
    <header className="sticky top-0 z-10 flex flex-col">

      {/* Top row */}
      <div className="bg-mist-950 flex items-center">

        {/* Logo */}
        <NavItem
          to="/about"
          ariaLabel="About"
          icon={<Logo size="md" />}
          active={pathname === "/about"}
          variant="icon"
        />

        {/* Workout */}
        <NavItem
          to="/workout"
          label="Workout"
          icon={<IconBarbellFilled size={16} />}
          active={isWorkout}
          onClick={() => setOpen(false)}
        />

        {/* Routine */}
        <NavItem
          to="/routine"
          label="Routine"
          icon={<IconListCheckFilled size={16} />}
          active={isRoutine}
          onClick={() => setOpen(false)}
        />

        {/* Menu */}
        <IconButton
          onClick={() => setOpen((prev) => !prev)}
          ariaLabel={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="text-mist-500 m-0"
        >
          {open ? (
            <IconX size={24} aria-hidden="true" />
          ) : (
            <IconMenu2 size={24} aria-hidden="true" />
          )}
        </IconButton>
      </div>

      {/* Accordion */}
      <div className={`overflow-hidden transition-all duration-200 ${open ? "max-h-40" : "max-h-0"
        }`}
        aria-hidden={!open}
      >
        {open && (
          <div className="flex flex-col bg-mist-950">

            <NavItem
              to="/legal"
              label="Legal notice"
              icon={<IconFileText size={16} />}
              active={isLegal}
              onClick={() => setOpen(false)}
            />

            <NavItem
              to="/privacy"
              label="Privacy policy"
              icon={<IconShield size={16} />}
              active={isPrivacy}
              onClick={() => setOpen(false)}
            />

          </div>
        )}
      </div>
    </header>
  )
}