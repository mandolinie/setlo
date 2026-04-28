// 1. React / external libraries
import { IconTrash } from "@tabler/icons-react"

// 2. State
import { useHistoryStore } from "../stores/historyStore"

// 3. Components
import AppLayout from "../components/layout/AppLayout"
import Card from "../components/ui/Card"
import Footer from "../components/layout/Footer"
import IconButton from "../components/ui/IconButton"
import InfoBanner from "../components/ui/InfoBanner"

/* ------------------ helpers ------------------ */

function daysSinceLastWorkout(logs: { date: string }[]): number | null {
  if (logs.length === 0) return null
  const last = new Date(logs[0].date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  last.setHours(0, 0, 0, 0)
  return Math.floor((today.getTime() - last.getTime()) / 86_400_000)
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-")
  return `${d}.${m}.${y.slice(2)}`
}

type BannerConfig = {
  variant: "info" | "success" | "warning" | "error"
  message: string
}

function getBanner(days: number | null): BannerConfig {
  if (days === null)
    return { variant: "info", message: "No workouts logged yet. Start your first session!" }
  if (days === 0)
    return { variant: "success", message: "Great work — you trained today!" }
  if (days <= 2)
    return { variant: "success", message: `Last workout ${days} day${days > 1 ? "s" : ""} ago. Keep it up!` }
  if (days <= 4)
    return { variant: "warning", message: `Last workout ${days} days ago. Time to get moving!` }
  return { variant: "error", message: `${days} days since your last workout. Let's go!` }
}

/* ------------------ screen ------------------ */

export default function HistoryScreen() {
  const { logs, deleteLog } = useHistoryStore()

  const days = daysSinceLastWorkout(logs)
  const banner = getBanner(days)

  return (
    <AppLayout footer={<Footer />}>
      <div className="contentbg">

        <h1>History</h1>

        <InfoBanner variant={banner.variant}>{banner.message}</InfoBanner>

        {logs.length > 0 ? (
          <Card variant="default" className="p-5 gap-4 overflow-hidden">
            {logs.map((log, index) => (
              <div
                key={log.id}
                className={`flex items-center justify-between ${
                  index < logs.length - 1 ? "border-mist-700" : ""
                }`}
              >
                <span className="tabular-nums text-base font-medium text-mist-400">
                  {formatDate(log.date)}
                </span>

                <div className="flex items-center gap-4">
                  <span className="text-base font-medium text-mist-400 uppercase">
                    {log.routineName}{" "}
                    <span className="tabular-nums">
                      {log.completedSets}/{log.plannedSets}
                    </span>
                  </span>

                  <IconButton
                    onClick={() => deleteLog(log.id)}
                    ariaLabel={`Delete workout log from ${formatDate(log.date)}`}
                  >
                    <IconTrash size={20} aria-hidden="true" />
                  </IconButton>
                </div>
              </div>
            ))}
          </Card>
        ) : null}

      </div>
    </AppLayout>
  )
}
