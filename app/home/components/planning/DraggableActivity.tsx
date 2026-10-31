import { useDraggable } from '@dnd-kit/react'
import styles from './styles/CalendarPlanning.module.css'
import { Activity } from '../../types/Activity'
import { categoryTint } from '../../categoryTint'

export function DraggableActivity({ activity, stop }: { activity: Activity; stop?: number }) {
  const { ref, isDragging } = useDraggable({ id: activity.id })
  const category = activity.categories?.[0]?.name
  const tint = categoryTint(category ?? activity.name ?? '')
  return (
    <li ref={ref} className={`item ${styles.activityItem} ${isDragging ? styles.activityItemDragging : ''}`}>
      <div className={`${styles['pool-item']} ${stop ? styles.scheduled : ''}`}>
        <div className={styles['pool-emoji']} style={tint} aria-hidden="true">
          {activity.name?.[0]}
        </div>
        <div className={styles['pool-info']}>
          <div className={styles['pool-name']} title={activity.name}>
            {activity.name}
          </div>
          <div className={styles['pool-meta']}>
            {category ? (
              <span className={styles['pool-tag']} style={tint}>
                {category}
              </span>
            ) : null}
            <span className={styles['pool-addr']} title={activity.address}>
              {activity.address}
            </span>
          </div>
        </div>
        {stop ? (
          <span className={styles['pool-stop']} aria-label={`Stop ${stop} in your day`}>
            {stop}
          </span>
        ) : (
          <div className={styles['pool-drag-icon']} aria-hidden="true">
            ⠿
          </div>
        )}
      </div>
    </li>
  )
}
