// 1. React / external libraries
import { useEffect, useState } from "react"
import {
  IconChevronLeft,
  IconChevronRight,
  IconPlayerPlayFilled,
  IconPlayerPauseFilled,
  IconRepeat,
  IconFlag,
  IconPlus,
  IconMinus,
  IconRotateClockwise,
  IconClock,
  IconNote,
} from "@tabler/icons-react"

// 2. State / hooks (app logic)
import { useSessionStore } from "../stores/sessionStore"
import { useExerciseStore, ALL_ROUTINE_ID } from "../stores/exerciseStore"

// 3. Utilities
import { formatExerciseTime, formatReps } from "../utils/format"

// 4. Components
import AppLayout from "../components/layout/AppLayout"
import Card from "../components/ui/Card"
import Footer from "../components/layout/Footer"
import IconButton from "../components/ui/IconButton"
import PillButton from "../components/ui/PillButton"
import ProgressBar from "../components/ui/ProgressBar"
import RoutineSelector from "../components/ui/RoutineSelector"
import SectionHeader from "../components/ui/SectionHeader"

const formatTime = (ms: number) => {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  const milliseconds = Math.floor((ms % 1000) / 10)

  const m = String(minutes).padStart(2, "0")
  const s = String(seconds).padStart(2, "0")
  const msStr = String(milliseconds).padStart(2, "0")

  return `${m}:${s}:${msStr}`
}

export default function WorkoutScreen() {
  const {
    isActive,
    exercises,
    currentExerciseId,
    setCounts,

    startWorkout,
    resetWorkout,

    nextExercise,
    prevExercise,

    incrementSet,
    decrementSet,
    resetSets,

    startTimer,
    pauseTimer,
    resetTimer,
    getElapsedTime,
    isRunning,
  } = useSessionStore()

  const allExercises = useExerciseStore((s) => s.exercises)
  const activeRoutineId = useExerciseStore((s) => s.activeRoutineId)
  const activeRoutineExercises = (
    activeRoutineId === ALL_ROUTINE_ID
      ? allExercises
      : allExercises.filter((e) => e.routineIds.includes(activeRoutineId))
  ).sort((a, b) => a.order - b.order)

  const [time, setTime] = useState(0)

  // Live timer update
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getElapsedTime())
    }, 50)

    return () => clearInterval(interval)
  }, [getElapsedTime])

  const currentExercise = exercises.find((e) => e.id === currentExerciseId)

  const currentSet = currentExerciseId ? setCounts[currentExerciseId] ?? 0 : 0
  const canDecreaseSet = currentSet > 0
  const hasExercises = activeRoutineExercises.length > 0

  const totalSets = exercises.reduce((sum, e) => sum + e.totalSets, 0)
  const completedSets = Object.entries(setCounts).reduce(
    (sum, [id, count]) => {
      const exercise = exercises.find((e) => e.id === id)
      if (!exercise) return sum
      return sum + Math.min(count, exercise.totalSets)
    },
    0
  )
  const progress = totalSets === 0 ? 0 : completedSets / totalSets

  return (
    <AppLayout
      footer={
        <Footer>
          {!isActive ? (
            <PillButton
              onClick={startWorkout}
              fullWidth
              variant="success"
              disabled={!hasExercises}
            >
              Start workout
            </PillButton>
          ) : (
            <PillButton onClick={resetWorkout} fullWidth variant="error">
              Reset workout
            </PillButton>
          )}
        </Footer>
      }
    >

      {/* Pre-workout state */}
      {!isActive && (
        <div className="contentbg flex-1 justify-center items-center text-center">
          <div className="-mt-6 mb-3">
            <RoutineSelector centered />
          </div>

          {hasExercises ? (
            <>
              <div className="text-2xl font-semibold">
                {activeRoutineExercises.length} Exercises
              </div>
              <div className="smalltext">Ready?</div>
            </>
          ) : (
            <div className="smalltext">No exercises in this routine.</div>
          )}
        </div>
      )}

      {/* Active workout */}
      {isActive && currentExercise && (
        <div className="contentbg">

          {/* Exercise Card */}
          <Card variant="ghost">
            <h2 className="text-3xl font-semibold text-mist-50">
              {currentExercise.name.toUpperCase()}
            </h2>

            <div className="flex justify-center gap-3 smalltext">
              <div className="flex items-center gap-1">
                <IconRepeat size={16} aria-hidden="true" />
                <span>{currentExercise.totalSets}</span>
              </div>

              {currentExercise.type === "reps" ? (
                <div className="flex items-center gap-1">
                  <IconFlag size={16} aria-hidden="true" />
                  <span>
                    {formatReps(
                      currentExercise.minReps,
                      currentExercise.maxReps
                    )}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <IconClock size={16} aria-hidden="true" />
                  <span>{formatExerciseTime(currentExercise.time ?? 0)}</span>
                </div>
              )}

              {currentExercise.notes && (
                <div className="flex items-center gap-1">
                  <IconNote size={16} aria-hidden="true" />
                  <span className="normal-case">{currentExercise.notes}</span>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              <PillButton onClick={prevExercise} aria-label="Previous exercise">
                <IconChevronLeft size={20} aria-hidden="true" />
              </PillButton>

              <PillButton onClick={nextExercise} aria-label="Next exercise">
                <IconChevronRight size={20} aria-hidden="true" />
              </PillButton>
            </div>
          </Card>

          {/* Sets Card */}
          <Card variant="default">
            <SectionHeader
              label="Sets"
              action={
                <IconButton
                  onClick={resetSets}
                  ariaLabel={`Reset sets for ${currentExercise.name}`}
                >
                  <IconRotateClockwise size={20} aria-hidden="true" />
                </IconButton>
              }
            />

            <div
              aria-live="polite"
              className={`text-3xl text-center font-semibold ${
                currentSet >= currentExercise.totalSets ? "text-green-400" : ""
              }`}
            >
              {currentSet}
            </div>

            <div className="flex gap-3">
              <PillButton
                onClick={decrementSet}
                disabled={!canDecreaseSet}
                aria-label={`Decrease sets for ${currentExercise.name}`}
              >
                <IconMinus size={20} aria-hidden="true" />
              </PillButton>

              <PillButton
                onClick={incrementSet}
                aria-label={`Increase sets for ${currentExercise.name}`}
              >
                <IconPlus size={20} aria-hidden="true" />
              </PillButton>
            </div>
          </Card>

          {/* Timer Card */}
          <Card variant="default">
            <SectionHeader
              label="Timer"
              action={
                <IconButton onClick={resetTimer} ariaLabel="Reset timer">
                  <IconRotateClockwise size={20} aria-hidden="true" />
                </IconButton>
              }
            />

            <div
              aria-live="off"
              className="text-3xl text-center font-semibold tabular-nums"
            >
              {formatTime(time)}
            </div>

            <PillButton
              onClick={isRunning ? pauseTimer : startTimer}
              aria-label={isRunning ? "Pause timer" : "Start timer"}
            >
              {isRunning ? (
                <IconPlayerPauseFilled size={20} aria-hidden="true" />
              ) : (
                <IconPlayerPlayFilled size={20} aria-hidden="true" />
              )}
            </PillButton>
          </Card>

          {/* Progress Card */}
          <Card variant="ghost">
            <SectionHeader
              label={
                <span className="tabular-nums">
                  {completedSets}/{totalSets} Completed
                </span>
              }
            />
            <ProgressBar value={progress} />
          </Card>

        </div>
      )}

    </AppLayout>
  )
}
