// 1. React / external libraries
import { useState } from "react"
import { IconTrash, IconX } from "@tabler/icons-react"

// 2. State
import { useHistoryStore } from "../stores/historyStore"
import { useExerciseStore } from "../stores/exerciseStore"

// 3. Components
import AppLayout from "../components/layout/AppLayout"
import Card from "../components/ui/Card"
import Footer from "../components/layout/Footer"
import IconButton from "../components/ui/IconButton"
import InfoBanner from "../components/ui/InfoBanner"
import Modal from "../components/ui/Modal"
import PillButton from "../components/ui/PillButton"
import RoutineTag from "../components/ui/RoutineTag"
import SectionHeader from "../components/ui/SectionHeader"

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

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
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
  const { logs, addLog, deleteLog } = useHistoryStore()
  const { routines, exercises } = useExerciseStore()

  // Sort newest first regardless of insertion order
  const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date))

  const days = daysSinceLastWorkout(sortedLogs)
  const banner = getBanner(days)

  // Add entry modal state
  const [showAdd, setShowAdd] = useState(false)
  const [addDate, setAddDate] = useState(todayISO)
  const [addRoutineId, setAddRoutineId] = useState(() => routines[0]?.id ?? "")

  const openAdd = () => {
    setAddDate(todayISO())
    setAddRoutineId(routines[0]?.id ?? "")
    setShowAdd(true)
  }

  const handleAdd = () => {
    const routine = routines.find((r) => r.id === addRoutineId)
    if (!routine) return

    const routineExercises = exercises.filter((e) =>
      e.routineIds.includes(addRoutineId)
    )
    const plannedSets = routineExercises.reduce((sum, e) => sum + e.totalSets, 0)

    addLog({
      date: addDate,
      routineName: routine.name,
      completedSets: plannedSets,
      plannedSets,
    })
    setShowAdd(false)
  }

  return (
    <AppLayout
      footer={
        <Footer>
          <PillButton onClick={openAdd} fullWidth>
            Add entry
          </PillButton>
        </Footer>
      }
    >
      <div className="contentbg">

        <h1>History</h1>

        <InfoBanner variant={banner.variant}>{banner.message}</InfoBanner>

        {sortedLogs.length > 0 ? (
          <Card variant="default" className="p-5 gap-4 overflow-hidden">
            {sortedLogs.map((log, index) => (
              <div
                key={log.id}
                className={`flex items-center justify-between ${
                  index < sortedLogs.length - 1 ? "border-b border-mist-700 pb-4" : ""
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

      {/* Add entry modal */}
      {showAdd && (
        <Modal
          open={showAdd}
          onClose={() => setShowAdd(false)}
          variant="dialog"
          ariaLabel="Add history entry"
        >
          <Card className="w-full max-w-sm gap-4">

            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Add entry</span>
              <IconButton onClick={() => setShowAdd(false)} ariaLabel="Close">
                <IconX size={20} aria-hidden="true" />
              </IconButton>
            </div>

            {/* Date */}
            <Card variant="dark">
              <SectionHeader label="Date" />
              <input
                type="date"
                lang="en-GB"
                value={addDate}
                max={todayISO()}
                onChange={(e) => setAddDate(e.target.value)}
                className="bg-transparent text-xl font-semibold tabular-nums outline-none w-full uppercase"
              />
            </Card>

            {/* Routine */}
            <Card variant="dark">
              <SectionHeader label="Routine" />
              <div className="flex flex-wrap gap-2">
                {routines.map((routine) => (
                  <RoutineTag
                    key={routine.id}
                    label={routine.name}
                    selected={routine.id === addRoutineId}
                    onClick={() => setAddRoutineId(routine.id)}
                  />
                ))}
              </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <PillButton onClick={() => setShowAdd(false)} fullWidth>
                Cancel
              </PillButton>
              <PillButton
                variant="success"
                fullWidth
                onClick={handleAdd}
                disabled={!addRoutineId || !addDate}
              >
                Add
              </PillButton>
            </div>

          </Card>
        </Modal>
      )}

    </AppLayout>
  )
}
