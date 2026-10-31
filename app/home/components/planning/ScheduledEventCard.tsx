import { useDraggable } from '@dnd-kit/react'
import styles from './styles/CalendarPlanning.module.css'
import { formatHour, SLOT_HEIGHT } from './utility/calendarUtils'
import { ScheduledActivity } from './utility/calendarTypes'

const STEP = 0.5
const MIN_DURATION = 0.5
const MAX_DURATION = 8

export function ScheduledEventCard({
  event,
  stop,
  hour,
  onRemove,
  onChangeDuration,
}: {
  event: ScheduledActivity
  stop?: number
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
        {stop ? <span className={styles.stopNumber}>{stop}</span> : null}
        <div style={{ minWidth: 0 }}>
          <div className={styles.eventName}>{event.name}</div>
          <div className={styles.eventTimeRange}>
            {formatHour(hour)} – {formatHour(hour + event.durationHours)}
          </div>
        </div>
      </div>
      <div className={styles.eventToolbar}>
        <div className={styles.durationAdjuster}>
          <button
            className={styles.adjustButton}
            aria-label="Shorten by 30 minutes"
            disabled={event.durationHours <= MIN_DURATION}
            onClick={() => onChangeDuration(event.id, -STEP)}
          >
            −
          </button>
          <span className={styles.durationText}>{event.durationHours} h</span>
          <button
            className={styles.adjustButton}
            aria-label="Lengthen by 30 minutes"
            disabled={event.durationHours >= MAX_DURATION}
            onClick={() => onChangeDuration(event.id, STEP)}
          >
            +
          </button>
        </div>
        <button
          className={styles.closeButton}
          aria-label={`Remove ${event.name} from your day`}
          onClick={() => onRemove(event.id)}
        >
          ×
        </button>
      </div>
    </div>
  )
}
