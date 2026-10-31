import { useDroppable } from '@dnd-kit/react'
import styles from './styles/CalendarPlanning.module.css'
import { ScheduledActivity } from './utility/calendarTypes'
import { ScheduledEventCard } from './ScheduledEventCard'

export function HourSlot({
  hour,
  event,
  stop,
  isCovered,
  onRemove,
  onChangeDuration,
}: {
  hour: number
  event?: ScheduledActivity
  stop?: number
  isCovered: boolean
  onRemove: (id: string) => void
  onChangeDuration: (_: string, __: number) => void
}) {
  const { ref, isDropTarget } = useDroppable({ id: `hour-${hour}` })

  const slotClass = [
    styles.timeSlot,
    Number.isInteger(hour) ? '' : styles.timeSlotHalf,
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
          stop={stop}
          hour={hour}
          onRemove={onRemove}
          onChangeDuration={onChangeDuration}
        />
      )}
    </div>
  )
}
