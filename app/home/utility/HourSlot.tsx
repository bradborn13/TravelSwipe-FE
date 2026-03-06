import { useDroppable } from '@dnd-kit/react'
import styles from './CalendarPlanning.module.css'
import { ScheduledEventCard } from './ScheduledEventCard'
import type { ScheduledActivity } from './calendarTypes'

export function HourSlot({
  hour,
  event,
  isCovered,
  onRemove,
  onChangeDuration,
}: {
  hour: number
  event?: ScheduledActivity
  isCovered: boolean
  onRemove: (id: string) => void
  onChangeDuration: (_: string, __: number) => void
}) {
  const { ref, isDropTarget } = useDroppable({ id: `hour-${hour}` })

  const slotClass = [
    styles.timeSlot,
    isCovered && !event ? styles.timeSlotCovered : '',
    !isCovered && isDropTarget ? styles.timeSlotHighlighted : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={ref} className={slotClass}>
      {event && (
        <ScheduledEventCard
          event={event}
          hour={hour}
          onRemove={onRemove}
          onChangeDuration={onChangeDuration}
        />
      )}
    </div>
  )
}
