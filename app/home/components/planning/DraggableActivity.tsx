import { useDraggable } from '@dnd-kit/react'
import styles from './styles/CalendarPlanning.module.css'
import { Activity } from '../../types/Activity'

export function DraggableActivity({ activity }: { activity: Activity }) {
  const { ref, isDragging } = useDraggable({ id: activity.id })
  return (
    <li ref={ref} className={`item ${styles.activityItem} ${isDragging ? styles.activityItemDragging : ''}`}>
      <div className={styles['pool-item']}>
        <div className={styles['pool-emoji']} style={{ background: '#FFE9E4' }}>
          🎭
        </div>
        <div className={styles['pool-info']}>
          <div className={styles['pool-name']}> {activity.name}</div>
          <div className={styles['pool-addr']}> {activity.address}</div>
        </div>
        <div>
          <div className={styles['pool-tag']} style={{ background: '#FFE9E4' }}>
            {activity.name}
          </div>
        </div>
        <div className={styles['pool-drag-icon']}>⠿</div>
      </div>
    </li>
  )
}
