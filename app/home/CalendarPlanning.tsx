import { useState, useEffect, useMemo, Fragment } from 'react'
import { DragDropProvider } from '@dnd-kit/react'
import type { DragEndEvent } from '@dnd-kit/react'
import styles from './utility/CalendarPlanning.module.css'
import { HOURS, formatHour, isSlotCovered } from './utility/calendarUtils'
import { HourSlot } from './utility/HourSlot'
import type { ScheduledActivity } from './utility/calendarTypes'
import { DraggableActivity } from './utility/DraggableActivity'
import { Activity } from './types/Activity'
import { Map, MapControls, MapMarker, MarkerContent, MarkerPopup, MapRoute } from '@/components/ui/map'
import { MapPin } from 'lucide-react'
import { Card } from '@mui/material'

export const CalendarPlanning = ({ activityList }: { activityList: Activity[] }) => {
  const [scheduled, setScheduled] = useState<ScheduledActivity[]>([])
  const inPlanLocationCoordinates: [number, number][] = useMemo(() => {
    return (
      scheduled
        ?.sort((a, b) => a.startHour - b.startHour)
        .map((x) => {
          return [x.activity.longitude, x.activity.latitude]
        }) ?? []
    )
  }, [scheduled])
  console.log(scheduled, 'scheduled')
  useEffect(() => {
    setScheduled([])
  }, [activityList])
  console.log(
    scheduled
      ?.sort((x) => x.startHour)
      .map((x) => {
        return [x.activity.longitude, x.activity.longitude]
      }),
    'coor',
  )
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
            activity: activity,
          },
        ]
      })
    }
  }

  return (
    <div>
      <DragDropProvider onDragEnd={handleDragEnd}>
        <div className="flex flex-row justify-between ">
          <div className={styles['grid-panel-0']}>
            <div className={styles['grid-header']}>
              <div>
                <h3>Saturday, June 14</h3>
                <p>3 activities · ~6.5h planned</p>
              </div>
              <div className={styles['grid-panel-a']}>
                <span className={styles['grid-panel-b']}>Clear day</span>
              </div>
              <div className={styles['day-tabs']}></div>
            </div>
            <div>
              <div className={styles.timelineColumn}>
                <div className={styles.timeGrid}>
                  {HOURS.map((hour) => {
                    const event = scheduled.find((a) => a.startHour === hour)
                    const covered = isSlotCovered(scheduled, hour)
                    return (
                      <Fragment key={hour}>
                        <div className={styles.timeLabel}>
                          {Number.isInteger(hour) ? formatHour(hour) : ''}
                        </div>
                        <HourSlot
                          hour={hour}
                          event={event}
                          isCovered={covered}
                          onRemove={handleRemove}
                          onChangeDuration={handleChangeDuration}
                        />
                      </Fragment>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.activitySidebar}>
            <div className={styles['pool-panel']}>
              <div className={styles['pool-title']}>All Activities</div>
              <div className={styles['pool-sub']}>Drag any card onto the time grid →</div>
              <div className={styles['pool-list']}>
                {activityList?.map((activity: Activity) => (
                  <DraggableActivity key={activity.fsq_id} activity={activity} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </DragDropProvider>
      <Card style={{ height: '600px' }}>
        <Map center={[activityList[0].longitude, activityList[0].latitude]} zoom={15} theme={'light'}>
          {inPlanLocationCoordinates && inPlanLocationCoordinates.length > 1 && (
            <MapRoute coordinates={inPlanLocationCoordinates} color="#3b82f6" width={4} opacity={0.8} />
          )}

          {scheduled &&
            scheduled.length > 0 &&
            scheduled.map((x) => {
              return (
                <MapMarker key={x.id} longitude={x.activity.longitude} latitude={x.activity.latitude}>
                  <MarkerContent>
                    <div className="cursor-move">
                      <MapPin className="fill-black stroke-white dark:fill-white" size={28} />
                    </div>
                  </MarkerContent>
                  <MarkerPopup>{x.activity.name}</MarkerPopup>
                </MapMarker>
              )
            })}
          <MapControls />
        </Map>
      </Card>
    </div>
  )
}
