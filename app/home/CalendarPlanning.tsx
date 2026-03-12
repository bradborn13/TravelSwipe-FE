import { useState, useEffect, useMemo, Fragment, act } from 'react'
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

export const CalendarPlanning = ({ activityList }: { activityList?: Activity[] }) => {
  const [scheduled, setScheduled] = useState<ScheduledActivity[]>([])
  const inPlanLocationCoordinates = useMemo(() => {
    return scheduled
      ?.sort((a, b) => a.startHour - b.startHour)
      .map((x) => {
        return [x.activity.longitude, x.activity.latitude]
      })
  }, [scheduled])
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
  // const CurrentDate = () => {
  //   const today = new Date()
  //   const options: { weekday: string; month: string; day: string } = {
  //     weekday: 'long',
  //     month: 'long',
  //     day: 'numeric',
  //   }
  //   const formattedDate = new Intl.DateTimeFormat('en-US', options).format(today)
  //   return formattedDate
  // }
  const plannedEventsTime = useMemo(
    () => scheduled.reduce((sum, item) => sum + item.durationHours, 0),
    [scheduled],
  )
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
        <div className="flex flex-row justify-between gap-2">
          <div className={styles['grid-calendar']}>
            <div className={styles['grid-header']}>
              <div>
                {/* <h3>{CurrentDate()}</h3> */}
                <p>
                  {scheduled.length} activities · ~ {plannedEventsTime}h planned
                </p>
              </div>
              <div className={styles['grid-panel-a']}>
                <span className={styles['grid-panel-b']}>Clear day</span>
              </div>
            </div>
            <div className={styles['time-grid']}>
              {HOURS.map((hour) => {
                const event = scheduled.find((a) => a.startHour === hour)
                const covered = isSlotCovered(scheduled, hour)
                return (
                  <Fragment key={hour}>
                    <div className={styles['timeLabel']}>
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
          <Card className={styles['map-planning']}>
            {activityList && activityList.length > 0 && (
              <Map
                center={[activityList[0].longitude, activityList[0].latitude]}
                zoom={15}
                theme={'light'}
                className={styles['map-planning-01']}
              >
                {/* {activityList && inPlanLocationCoordinates && inPlanLocationCoordinates.length > 1 && (
                  <MapRoute coordinates={inPlanLocationCoordinates} color="#3b82f6" width={4} opacity={0.8} />
                )} */}

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
            )}
          </Card>
          <div className={styles['activity-sidebar']}>
            <div className={styles['pool-panel']}>
              <div className={styles['pool-title']}>All Activities</div>
              <div className={styles['pool-sub']}>Drag any card onto the time grid →</div>
              <div className={styles['pool-list']}>
                {activityList?.map((activity: Activity) => (
                  <DraggableActivity key={activity.fsq_id || activity.fsqId} activity={activity} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </DragDropProvider>
    </div>
  )
}
