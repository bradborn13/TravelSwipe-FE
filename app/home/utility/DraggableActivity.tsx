import { useDraggable } from '@dnd-kit/react'
import styles from './CalendarPlanning.module.css'
import { Activity } from './calendarTypes'

export function DraggableActivity({ activity }: { activity: Activity }) {
  const { ref, isDragging } = useDraggable({ id: activity.fsq_id })
  return (
    <li
      ref={ref}
      className={`item ${styles.activityItem} ${isDragging ? styles.activityItemDragging : ''}`}
    >
      {activity.name}
    </li>
  )
}
