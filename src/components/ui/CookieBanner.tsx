import { useState } from "react"
import { Link } from "react-router-dom"
import { getConsent, setConsent } from "../../utils/cookieConsent"
import Card from "./Card"
import PillButton from "./PillButton"

export default function CookieBanner() {
  const [visible, setVisible] = useState(() => getConsent() === null)

  if (!visible) return null

  const handle = (value: "accepted" | "declined") => {
    setConsent(value)
    setVisible(false)
  }

  return (
    <div className="dialogbg">
      <Card className="w-full max-w-sm text-center">
        <p>
          This app collects anonymized usage data via Google Analytics.{" "} Read more under
          <Link to="/privacy" className="underline text-mist-50 hover:text-green-400 normal-case">
            privacy
          </Link>.
        </p>

        <div className="flex gap-3 mt-4">
          <PillButton onClick={() => handle("declined")} fullWidth>
            Decline
          </PillButton>
          <PillButton variant="success" onClick={() => handle("accepted")} fullWidth>
            Accept
          </PillButton>
        </div>
      </Card>
    </div>
  )
}
