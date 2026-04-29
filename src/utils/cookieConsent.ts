const STORAGE_KEY = "cookie_consent"
const GA_ID = import.meta.env.VITE_GA_ID as string | undefined

export type ConsentValue = "accepted" | "declined"

export function getConsent(): ConsentValue | null {
  return localStorage.getItem(STORAGE_KEY) as ConsentValue | null
}

export function setConsent(value: ConsentValue) {
  localStorage.setItem(STORAGE_KEY, value)
  if (value === "accepted") loadGoogleAnalytics()
}

function loadGoogleAnalytics() {
  if (!GA_ID || typeof window.gtag !== "undefined") return

  const script = document.createElement("script")
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  script.async = true
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function () {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments)
  }

  window.gtag("js", new Date())
  window.gtag("config", GA_ID, { anonymize_ip: true })
}

// Load GA immediately if already accepted (on app start)
if (getConsent() === "accepted") loadGoogleAnalytics()
