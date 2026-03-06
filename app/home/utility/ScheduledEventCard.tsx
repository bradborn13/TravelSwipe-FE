import { useDraggable } from '@dnd-kit/react'
import styles from './CalendarPlanning.module.css'
import { SLOT_HEIGHT, formatHour } from './calendarUtils'
import type { ScheduledActivity } from './calendarTypes'

const STEP = 0.5
const MIN_DURATION = 0.5
const MAX_DURATION = 4

export function ScheduledEventCard({
  event,
  hour,
  onRemove,
  onChangeDuration,
}: {
  event: ScheduledActivity
  hour: number
  onRemove: (id: string) => void
  onChangeDuration: (_: string, __: number) => void
}) {
  const { ref, handleRef, isDragging } = useDraggable({ id: `scheduled-${event.id}` })

  return (
    <div
      ref={ref}
      className={styles.eventBlock}
      style={{
        height: SLOT_HEIGHT * event.durationHours - 8,
        background: event.color,
        opacity: isDragging ? 0.4 : 1,
      }}
    >
      <div ref={handleRef} className={styles.dragHandle}>
        <div>{event.name}</div>
        <div className={styles.eventTimeRange}>
          {formatHour(hour)} – {formatHour(hour + event.durationHours)}
        </div>
      </div>
      <div className={styles.eventToolbar}>
        <button className={styles.closeButton} onClick={() => onRemove(event.id)}>
          ×
        </button>
        <div className={styles.durationAdjuster}>
          <button
            className={styles.adjustButton}
            disabled={event.durationHours <= MIN_DURATION}
            onClick={() => onChangeDuration(event.id, -STEP)}
          >
            −
          </button>
          <span className={styles.durationText}>{event.durationHours}h</span>
          <button
            className={styles.adjustButton}
            disabled={event.durationHours >= MAX_DURATION}
            onClick={() => onChangeDuration(event.id, STEP)}
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}
