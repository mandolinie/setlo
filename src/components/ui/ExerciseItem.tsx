import { formatExerciseTime, formatReps } from "../../utils/format"
import Card from "../ui/Card"
import IconButton from "../ui/IconButton"
import type { Exercise } from "../../types/exercise"
import {
  IconEdit,
  IconTrash,
  IconRepeat,
  IconFlag,
  IconGripVertical,
  IconClock,
  IconNote,
} from "@tabler/icons-react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

type Props = {
  exercise: Exercise
  onEdit: () => void
  onDelete: () => void
}

export default function ExerciseItem({
  exercise,
  onEdit,
  onDelete,
}: Props) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: exercise.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      variant="default"
    >

      <div className="flex items-center gap-3">

        {/* DRAG HANDLE */}
        <IconButton
          ariaLabel={`Reorder ${exercise.name}`}
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing"
        >
          <IconGripVertical size={20} aria-hidden="true"/>
        </IconButton>

        {/* CONTENT */}
        <div className="flex flex-1 justify-between items-center">

          {/* Left */}
          <div className="flex flex-col items-start gap-1">
            <div className="text-lg font-semibold text-left leading-5">
              {exercise.name.toUpperCase()}
            </div>

            <div className="flex gap-3 smalltext">

              {/* Sets */}
              <div className="flex items-center gap-1">
                <IconRepeat size={16} aria-hidden="true" />
                <span>{exercise.totalSets}</span>
              </div>

              {exercise.type === "reps" ? (
                <div className="flex items-center gap-1">
                  <IconFlag size={16} aria-hidden="true" />
                  <span>
                    {formatReps(exercise.minReps, exercise.maxReps)}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <IconClock size={16} aria-hidden="true" />
                  <span>{formatExerciseTime(exercise.time)}</span>
                </div>
              )}

              {exercise.notes && (
                <div className="flex items-center gap-1">
                  <IconNote size={16} aria-hidden="true" />
                  <span>{exercise.notes}</span>
                </div>
              )}

            </div>

          </div>

          {/* Right */}
          <div className="flex gap-4">
            <IconButton
              onClick={onEdit}
              ariaLabel={`Edit ${exercise.name}`}
            >
              <IconEdit size={20} aria-hidden="true" />
            </IconButton>

            <IconButton
              onClick={onDelete}
              ariaLabel={`Delete ${exercise.name}`}
            >
              <IconTrash size={20} aria-hidden="true" />
            </IconButton>
          </div>

        </div>
      </div>

    </Card>
  )
}