import React, { useState, useEffect } from 'react'
import { DragDropProvider } from '@dnd-kit/react'
import type { DragEndEvent } from '@dnd-kit/react'
import styles from './utility/CalendarPlanning.module.css'
import { HOURS, formatHour, isSlotCovered } from './utility/calendarUtils'
import { HourSlot } from './utility/HourSlot'
import type { Activity, ScheduledActivity } from './utility/calendarTypes'
import { DraggableActivity } from './utility/DraggableActivity'

export const CalendarPlanning = ({ activityList }: { activityList?: Activity[] }) => {
  const [scheduled, setScheduled] = useState<ScheduledActivity[]>([])
  console.log(scheduled, 'scheduled')
  useEffect(() => {
    setScheduled([])
  }, [activityList])

  const handleRemove = (id: string) => {
    setScheduled((prev) => prev.filter((s) => s.id !== id))
  }

  const handleChangeDuration = (id: string, delta: number) => {
    setScheduled((prev) =>
      prev.map((s) => (s.id === id ? { ...s, durationHours: s.durationHours + delta } : s)),
    )
  }

  const handleDragEnd: DragEndEvent = (event) => {
    const { operation } = event
    if (!operation.source || !operation.target) return

    const sourceId = operation.source.id as string
    const slotId = operation.target.id as string // e.g. 'hour-10'
    const hour = parseFloat(slotId.replace('hour-', ''))
    if (isNaN(hour)) return

    if (sourceId.startsWith('scheduled-')) {
      const eventId = sourceId.replace('scheduled-', '')
      // Allow moving into a covered slot only if it's covered by the event itself
      if (isSlotCovered(scheduled, hour, eventId)) return
      setScheduled((prev) => {
        const moving = prev.find((s) => s.id === eventId)
        if (!moving) return prev
        return [
          ...prev.filter((s) => s.id !== eventId && s.startHour !== hour),
          { ...moving, startHour: hour },
        ]
      })
    } else {
      if (isSlotCovered(scheduled, hour)) return
      const activity = activityList?.find((a: Activity) => a.fsq_id === sourceId)
      if (!activity) return

      setScheduled((prev) => {
        const existing = prev.find((s) => s.id === sourceId)
        return [
          ...prev.filter((s) => s.id !== sourceId && s.startHour !== hour),
          {
            id: sourceId,
            name: activity.name,
            startHour: hour,
            // Preserve custom duration if the activity was already on the calendar
            durationHours: existing?.durationHours ?? 1,
            color: existing?.color ?? '#4A90E2',
          },
        ]
      })
    }
  }

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div className="flex flex-row justify-between">
        <div className={styles.timelineColumn}>
          <div className={styles.timeGrid}>
            {HOURS.map((hour) => {
              const event = scheduled.find((a) => a.startHour === hour)
              const covered = isSlotCovered(scheduled, hour)
              return (
                <React.Fragment key={hour}>
                  <div className={styles.timeLabel}>{Number.isInteger(hour) ? formatHour(hour) : ''}</div>
                  <HourSlot
                    hour={hour}
                    event={event}
                    isCovered={covered}
                    onRemove={handleRemove}
                    onChangeDuration={handleChangeDuration}
                  />
                </React.Fragment>
              )
            })}
          </div>
        </div>

        <div className={styles.activitySidebar}>
          <ul className="list">
            {activityList?.map((activity: Activity) => (
              <DraggableActivity key={activity.fsq_id} activity={activity} />
            ))}
          </ul>
        </div>
      </div>
    </DragDropProvider>
  )
}
