// 1. React / external libraries
import { useState, useRef, useEffect } from "react"
import {
  IconPlus,
  IconMinus,
  IconX,
  IconArrowsLeftRight,
  IconGripVertical,
  IconSettings,
  IconTrash,
} from "@tabler/icons-react"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { DragEndEvent } from "@dnd-kit/core"

// 2. State / hooks (app logic)
import { useExerciseStore, ALL_ROUTINE_ID } from "../stores/exerciseStore"
import { generateId } from "../utils/id"
import { useSessionStore } from "../stores/sessionStore"

// 3. Utilities
import { formatExerciseTime } from "../utils/format"

// 4. Components
import AppLayout from "../components/layout/AppLayout"
import InfoBanner from "../components/ui/InfoBanner"
import Card from "../components/ui/Card"
import ExerciseItem from "../components/ui/ExerciseItem"
import Footer from "../components/layout/Footer"
import IconButton from "../components/ui/IconButton"
import Modal from "../components/ui/Modal"
import PillButton from "../components/ui/PillButton"
import RoutineSelector from "../components/ui/RoutineSelector"
import RoutineTag from "../components/ui/RoutineTag"
import SectionHeader from "../components/ui/SectionHeader"

// 5. Types
import type { Exercise } from "../types/exercise"

/* ------------------ local types ------------------ */

type DraftExerciseBase = {
  id?: string
  name: string
  totalSets: number
  order?: number
  notes?: string
  routineIds: string[]
}

type DraftExercise =
  | (DraftExerciseBase & { type: "reps"; minReps: number; maxReps: number })
  | (DraftExerciseBase & { type: "time"; time: number })

type ModalState =
  | { type: "none" }
  | { type: "edit"; draft: DraftExercise }
  | { type: "confirmDelete"; exercise: Exercise; draft?: DraftExercise }
  | { type: "manageRoutines" }

/* ------------------ sortable routine card ------------------ */

type RoutineDraft = { id: string; name: string }

type SortableRoutineCardProps = {
  entry: RoutineDraft
  index: number
  total: number
  inputRef: (el: HTMLInputElement | null) => void
  onChange: (value: string) => void
  onDelete: () => void
}

function SortableRoutineCard({
  entry,
  index,
  total,
  inputRef,
  onChange,
  onDelete,
}: SortableRoutineCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: entry.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Card ref={setNodeRef} style={style} variant="dark">
      <div className="flex items-center gap-3">

        {/* DRAG HANDLE */}
        <IconButton
          ariaLabel={`Reorder ${entry.name || `routine ${index + 1}`}`}
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing"
        >
          <IconGripVertical size={20} aria-hidden="true" />
        </IconButton>

        {/* CONTENT */}
        <div className="flex flex-col flex-1 gap-2">
          <SectionHeader
            label={`Routine ${index + 1}`}
            action={
              <IconButton
                onClick={onDelete}
                ariaLabel={`Remove ${entry.name || `routine ${index + 1}`}`}
                disabled={total <= 1}
              >
                <IconTrash size={20} aria-hidden="true" />
              </IconButton>
            }
          />
          <input
            ref={inputRef}
            aria-label={`Routine ${index + 1} name`}
            value={entry.name}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur()
            }}
            className="bg-transparent text-xl font-semibold outline-none uppercase"
          />
        </div>

      </div>
    </Card>
  )
}

/* ------------------ screen ------------------ */

export default function RoutineScreen() {
  const {
    exercises,
    routines,
    activeRoutineId,
    addExerciseSafe,
    updateExerciseById,
    deleteExerciseSafe,
    reorderExercises,
    setRoutines,
  } = useExerciseStore()

  const activeRoutineExercises = (
    activeRoutineId === ALL_ROUTINE_ID
      ? exercises
      : exercises.filter((e) => e.routineIds.includes(activeRoutineId))
  ).sort((a, b) => a.order - b.order)

  const [modal, setModal] = useState<ModalState>({ type: "none" })

  // Draft state for manage routines modal
  const [routineDrafts, setRoutineDrafts] = useState<RoutineDraft[]>([])

  const inputRef = useRef<HTMLInputElement>(null)
  const routineInputRefs = useRef<(HTMLInputElement | null)[]>([])
  const shouldFocusNewRoutineRef = useRef(false)

  const draft =
    modal.type === "edit" ? modal.draft :
    modal.type === "confirmDelete" ? (modal.draft ?? null) :
    null

  // Auto-focus name input on new exercise
  useEffect(() => {
    if (modal.type !== "edit") return
    if (!modal.draft.id) {
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal.type])

  // Initialise drafts from store each time the manage modal opens
  useEffect(() => {
    if (modal.type === "manageRoutines") {
      setRoutineDrafts(routines.map((r) => ({ id: r.id, name: r.name })) as RoutineDraft[])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal.type])

  // Focus the newly added routine input
  useEffect(() => {
    if (!shouldFocusNewRoutineRef.current) return
    shouldFocusNewRoutineRef.current = false
    routineInputRefs.current[routineDrafts.length - 1]?.focus()
  }, [routineDrafts.length])

  /* ---------- edit helpers ---------- */

  const startEdit = (exercise?: Exercise) => {
    setModal({
      type: "edit",
      draft: exercise
        ? { ...exercise }
        : {
            name: "",
            totalSets: 3,
            type: "reps",
            minReps: 8,
            maxReps: 12,
            routineIds:
              activeRoutineId === ALL_ROUTINE_ID
                ? routines.map((r) => r.id)
                : [activeRoutineId],
          },
    })
  }

  const updateDraft = (updates: Partial<DraftExercise>) => {
    if (modal.type !== "edit") return
    const current = modal.draft

    if ("type" in updates) {
      if (updates.type === "time") {
        setModal({
          type: "edit",
          draft: {
            id: current.id,
            name: current.name,
            totalSets: current.totalSets,
            order: current.order,
            notes: current.notes,
            routineIds: current.routineIds,
            type: "time",
            time: 60,
          },
        })
        return
      }
      if (updates.type === "reps") {
        setModal({
          type: "edit",
          draft: {
            id: current.id,
            name: current.name,
            totalSets: current.totalSets,
            order: current.order,
            notes: current.notes,
            routineIds: current.routineIds,
            type: "reps",
            minReps: 8,
            maxReps: 12,
          },
        })
        return
      }
    }

    setModal({
      type: "edit",
      draft: { ...current, ...updates } as DraftExercise,
    })
  }

  const saveDraft = () => {
    if (modal.type !== "edit") return
    const draft = modal.draft

    if (draft.id) {
      updateExerciseById(draft.id, draft)
    } else {
      addExerciseSafe(draft)
    }

    setModal({ type: "none" })
  }

  const confirmRemove = () => {
    if (modal.type !== "confirmDelete") return
    deleteExerciseSafe(modal.exercise.id)
    setModal({ type: "none" })
  }

  /* ---------- routine tag helpers ---------- */

  const toggleRoutine = (routineId: string) => {
    if (!draft) return
    const isSelected = draft.routineIds.includes(routineId)
    const routineIds = isSelected
      ? draft.routineIds.filter((id) => id !== routineId)
      : [...draft.routineIds, routineId]
    updateDraft({ routineIds } as Partial<DraftExercise>)
  }

  /* ---------- manage routines helpers ---------- */

  const handleSaveRoutines = () => {
    setRoutines(routineDrafts)
    setModal({ type: "none" })
  }

  /* ---------- drag and drop ---------- */

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = activeRoutineExercises.findIndex((e) => e.id === active.id)
    const newIndex = activeRoutineExercises.findIndex((e) => e.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    reorderExercises(arrayMove(activeRoutineExercises, oldIndex, newIndex))
  }

  const handleRoutineDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setRoutineDrafts((prev) => {
      const oldIndex = prev.findIndex((r) => r.id === active.id)
      const newIndex = prev.findIndex((r) => r.id === over.id)
      if (oldIndex === -1 || newIndex === -1) return prev
      return arrayMove(prev, oldIndex, newIndex)
    })
  }

  /* ---------- derived values for edit form ---------- */

  const min = draft?.type === "reps" ? draft.minReps : 0
  const max = draft?.type === "reps" ? draft.maxReps : 0
  const canIncreaseMin = draft?.type === "reps" ? min < max : false
  const canDecreaseMax = draft?.type === "reps" ? max > min : false
  const canDecreaseMin = draft?.type === "reps" ? min > 0 : false
  const sets = draft?.totalSets ?? 0
  const canDecreaseSets = sets > 1

  const isWorkoutActive = useSessionStore((s) => s.isActive)

  return (
    <AppLayout
      footer={
        <Footer>
          <PillButton onClick={() => startEdit()} fullWidth>
            Add exercise
          </PillButton>
        </Footer>
      }
    >

      <div aria-hidden={modal.type !== "none"}>

        {/* Routine selector row */}
        <div className="flex items-center justify-between px-4 pt-4">
          <RoutineSelector />
          <IconButton
            onClick={() => setModal({ type: "manageRoutines" })}
            ariaLabel="Manage routines"
            className="m-0"
          >
            <IconSettings size={24} aria-hidden="true" />
          </IconButton>
        </div>

        {/* Exercise list */}
        {activeRoutineExercises.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={activeRoutineExercises.map((e) => e.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="contentbg">
                {activeRoutineExercises.map((e) => (
                  <ExerciseItem
                    key={e.id}
                    exercise={e}
                    onEdit={() => startEdit(e)}
                    onDelete={() =>
                      setModal({ type: "confirmDelete", exercise: e })
                    }
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="contentbg flex-1 justify-center text-center">
            <div className="smalltext">No exercises in this routine.</div>
          </div>
        )}

      </div>

      {/* ── EDIT MODAL ───────────────────────────────────────────── */}
      {(modal.type === "edit" || (modal.type === "confirmDelete" && modal.draft != null)) && draft && (
        <Modal
          open={modal.type === "edit" || (modal.type === "confirmDelete" && modal.draft != null)}
          onClose={() => { if (modal.type === "edit") setModal({ type: "none" }) }}
          variant="fullscreen"
          ariaLabel={draft.id ? "Edit exercise" : "Add exercise"}
        >
          <div className="flex justify-end p-4">
            <IconButton
              onClick={() => setModal({ type: "none" })}
              ariaLabel="Close dialog"
            >
              <IconX size={24} aria-hidden="true" />
            </IconButton>
          </div>

          <div className="flex flex-col gap-3 p-4 flex-1 overflow-y-auto">

            {isWorkoutActive && (
              <InfoBanner variant="warning">
                Changes won't affect current workout.
              </InfoBanner>
            )}

            {/* NAME */}
            <Card variant="dark">
              <SectionHeader label="Name" />
              <input
                aria-label="Exercise name"
                ref={inputRef}
                value={draft.name}
                onChange={(e) => updateDraft({ name: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    e.currentTarget.blur()
                  }
                }}
                className="bg-transparent text-xl font-semibold outline-none uppercase"
              />
            </Card>

            {/* SETS */}
            <Card variant="dark">
              <SectionHeader label="Total sets" />

              <div aria-live="polite" className="text-xl text-center font-semibold">
                {draft.totalSets}
              </div>

              <div className="flex gap-3">
                <PillButton
                  onClick={() =>
                    updateDraft({ totalSets: Math.max(1, draft.totalSets - 1) })
                  }
                  disabled={!canDecreaseSets}
                  aria-label="Decrease total sets"
                >
                  <IconMinus size={20} aria-hidden="true" />
                </PillButton>

                <PillButton
                  onClick={() => updateDraft({ totalSets: draft.totalSets + 1 })}
                  aria-label="Increase total sets"
                >
                  <IconPlus size={20} aria-hidden="true" />
                </PillButton>
              </div>
            </Card>

            {/* REPS / TIME */}
            <Card variant="dark">
              <SectionHeader
                label={draft.type === "reps" ? "Target reps" : "Duration per set"}
                action={
                  <IconButton
                    onClick={() =>
                      updateDraft({
                        type: draft.type === "reps" ? "time" : "reps",
                      })
                    }
                    ariaLabel={
                      draft.type === "reps"
                        ? "Switch to time-based exercise"
                        : "Switch to reps-based exercise"
                    }
                  >
                    <IconArrowsLeftRight size={20} aria-hidden="true" />
                  </IconButton>
                }
              />

              {draft.type === "reps" && (
                <div className="flex gap-3">
                  {/* Min reps */}
                  <div className="flex flex-1 flex-col gap-2">
                    <div aria-live="polite" className="text-xl text-center font-semibold">
                      {min}
                    </div>
                    <div className="flex justify-center gap-2">
                      <PillButton
                        onClick={() =>
                          updateDraft({
                            minReps: Math.max(0, min - 1),
                            maxReps: Math.max(min - 1, max),
                          })
                        }
                        disabled={!canDecreaseMin}
                      >
                        <IconMinus size={20} aria-hidden="true" />
                      </PillButton>
                      <PillButton
                        onClick={() =>
                          updateDraft({ minReps: Math.min(max, min + 1) })
                        }
                        disabled={!canIncreaseMin}
                      >
                        <IconPlus size={20} aria-hidden="true" />
                      </PillButton>
                    </div>
                  </div>

                  {/* Max reps */}
                  <div className="flex flex-1 flex-col gap-2">
                    <div aria-live="polite" className="text-xl text-center font-semibold">
                      {max}
                    </div>
                    <div className="flex justify-center gap-2">
                      <PillButton
                        onClick={() =>
                          updateDraft({ maxReps: Math.max(min, max - 1) })
                        }
                        disabled={!canDecreaseMax}
                        aria-label="Decrease maximum reps"
                      >
                        <IconMinus size={20} aria-hidden="true" />
                      </PillButton>
                      <PillButton
                        onClick={() => updateDraft({ maxReps: max + 1 })}
                        aria-label="Increase maximum reps"
                      >
                        <IconPlus size={20} aria-hidden="true" />
                      </PillButton>
                    </div>
                  </div>
                </div>
              )}

              {draft.type === "time" && (
                <>
                  <div aria-live="polite" className="text-xl text-center font-semibold">
                    {formatExerciseTime(draft.time)}
                  </div>
                  <div className="flex gap-3">
                    <PillButton
                      onClick={() =>
                        updateDraft({ time: Math.max(15, draft.time - 15) })
                      }
                      disabled={draft.time <= 15}
                      aria-label="Decrease duration"
                    >
                      <IconMinus size={20} aria-hidden="true" />
                    </PillButton>
                    <PillButton
                      onClick={() => updateDraft({ time: draft.time + 15 })}
                      aria-label="Increase duration"
                    >
                      <IconPlus size={20} aria-hidden="true" />
                    </PillButton>
                  </div>
                </>
              )}
            </Card>

            {/* NOTES */}
            <Card variant="dark">
              <SectionHeader label="Notes" />
              <input
                aria-label="Exercise notes"
                value={draft.notes ?? ""}
                onChange={(e) => updateDraft({ notes: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    e.currentTarget.blur()
                  }
                }}
                placeholder="e.g. 10 kg, 2 min rest"
                className="bg-transparent font-medium outline-none normal-case placeholder:text-mist-600 w-full"
              />
            </Card>

            {/* INCLUDED IN */}
            <Card variant="dark">
              <SectionHeader label="Included in" />
              <div className="flex flex-wrap gap-2 justify-start">
                {routines.map((routine) => {
                  const isSelected = draft.routineIds.includes(routine.id)
                  return (
                    <RoutineTag
                      key={routine.id}
                      label={routine.name}
                      selected={isSelected}
                      onClick={() => toggleRoutine(routine.id)}
                    />
                  )
                })}
              </div>
            </Card>

          </div>

          {/* Footer */}
          <div className="p-4 flex gap-3">
            {draft.id && (
              <PillButton
                variant="error"
                fullWidth
                onClick={() =>
                  setModal({
                    type: "confirmDelete",
                    exercise: exercises.find((e) => e.id === draft.id)!,
                    draft,
                  })
                }
              >
                Delete
              </PillButton>
            )}
            <PillButton variant="success" fullWidth onClick={saveDraft}>
              Save
            </PillButton>
          </div>
        </Modal>
      )}

      {/* ── CONFIRM DELETE MODAL ─────────────────────────────────── */}
      {modal.type === "confirmDelete" && (
        <Modal
          open={modal.type === "confirmDelete"}
          onClose={() =>
            modal.draft
              ? setModal({ type: "edit", draft: modal.draft })
              : setModal({ type: "none" })
          }
          variant="dialog"
          ariaLabel="Delete exercise"
        >
          <Card className="w-full max-w-sm text-center">
            <div className="text-lg font-semibold">Delete this exercise?</div>
            <div className="smalltext">{modal.exercise.name}</div>

            <div className="flex gap-3 mt-4">
              <PillButton
                onClick={() =>
                  modal.draft
                    ? setModal({ type: "edit", draft: modal.draft })
                    : setModal({ type: "none" })
                }
                fullWidth
                aria-label="Cancel deletion"
              >
                Cancel
              </PillButton>
              <PillButton
                variant="error"
                fullWidth
                onClick={confirmRemove}
                aria-label={`Delete ${modal.exercise.name}`}
              >
                Delete
              </PillButton>
            </div>
          </Card>
        </Modal>
      )}

      {/* ── MANAGE ROUTINES MODAL ────────────────────────────────── */}
      {modal.type === "manageRoutines" && (
        <Modal
          open={modal.type === "manageRoutines"}
          onClose={() => setModal({ type: "none" })}
          variant="fullscreen"
          ariaLabel="Manage routines"
        >
          <div className="flex justify-end p-4">
            <IconButton
              onClick={() => setModal({ type: "none" })}
              ariaLabel="Close dialog"
            >
              <IconX size={24} aria-hidden="true" />
            </IconButton>
          </div>

          <div className="flex flex-col gap-3 p-4 flex-1 overflow-y-auto">

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleRoutineDragEnd}
            >
              <SortableContext
                items={routineDrafts.map((r) => r.id)}
                strategy={verticalListSortingStrategy}
              >
                {routineDrafts.map((entry, index) => (
                  <SortableRoutineCard
                    key={entry.id}
                    entry={entry}
                    index={index}
                    total={routineDrafts.length}
                    inputRef={(el) => { routineInputRefs.current[index] = el }}
                    onChange={(value) =>
                      setRoutineDrafts((prev) =>
                        prev.map((d, i) =>
                          i === index ? { ...d, name: value } : d
                        )
                      )
                    }
                    onDelete={() =>
                      setRoutineDrafts((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                  />
                ))}
              </SortableContext>
            </DndContext>

            <div className="flex items-center justify-center">
              <IconButton
                onClick={() => {
                  shouldFocusNewRoutineRef.current = true
                  setRoutineDrafts((prev) => [
                    ...prev,
                    { id: generateId(), name: "" },
                  ])
                }}
                ariaLabel="Add routine"
                className="m-0"
              >
                <IconPlus size={24} aria-hidden="true" />
              </IconButton>
            </div>

          </div>

          <div className="p-4">
            <PillButton
              variant="success"
              fullWidth
              onClick={handleSaveRoutines}
              disabled={routineDrafts.filter((d) => d.name.trim()).length === 0}
            >
              Save
            </PillButton>
          </div>
        </Modal>
      )}

    </AppLayout>
  )
}
