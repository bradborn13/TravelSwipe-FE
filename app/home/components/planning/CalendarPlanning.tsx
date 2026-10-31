import { useState, useEffect, useMemo, useRef, Fragment } from 'react'
import { DragDropProvider } from '@dnd-kit/react'
import type { DragEndEvent } from '@dnd-kit/react'
import styles from './styles/CalendarPlanning.module.css'
import { HOURS, SLOT_HEIGHT, formatHour, isSlotCovered } from './utility/calendarUtils'
import { HourSlot } from './HourSlot'
import { DraggableActivity } from './DraggableActivity'
import { Activity } from '../../types/Activity'
import { Map, MapControls, MapMarker, MarkerContent, MarkerPopup, MapRoute } from '@/components/ui/map'
import { ScheduledActivity } from './utility/calendarTypes'

export const CalendarPlanning = ({ activityList }: { activityList?: Activity[] }) => {
  const [scheduled, setScheduled] = useState<ScheduledActivity[]>([])
  // the day's stops in time order: one numbering shared by the map pins, the day blocks and the list
  const stops = useMemo(() => [...scheduled].sort((a, b) => a.startHour - b.startHour), [scheduled])
  const stopNumber = useMemo(() => new globalThis.Map(stops.map((s, i) => [s.id, i + 1])), [stops])
  const inPlanLocationCoordinates = useMemo(
    () => stops.map((x): [number, number] => [x.activity.longitude, x.activity.latitude]),
    [stops],
  )
  useEffect(() => {
    setScheduled([])
  }, [activityList])

  // open the day at 8 AM rather than midnight
  const timeGridRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (timeGridRef.current) timeGridRef.current.scrollTop = 8 * SLOT_HEIGHT
  }, [])
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
      const activity = activityList?.find((a: Activity) => a.id === sourceId)
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
            color: existing?.color ?? '#1d5fd6',
            activity: activity,
          },
        ]
      })
    }
  }
  const plannedLabel =
    scheduled.length === 0
      ? 'Drag an activity onto a time'
      : `${scheduled.length} ${scheduled.length === 1 ? 'stop' : 'stops'} · ${plannedEventsTime} h planned`

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div className={styles.planner}>
        <section className={`${styles.panel} ${styles['activity-sidebar']}`} aria-labelledby="pool-title">
          <div className={styles.panelHeader}>
            <div>
              <h2 id="pool-title" className={styles.panelTitle}>
                Activities
              </h2>
              <p className={styles.panelSub}>
                {activityList?.length ?? 0} to choose from · drag one into your day
              </p>
            </div>
          </div>
          <ul className={styles['pool-list']}>
            {activityList?.map((activity: Activity) => (
              <DraggableActivity key={activity.id} activity={activity} stop={stopNumber.get(activity.id)} />
            ))}
          </ul>
        </section>

        <section className={`${styles.panel} ${styles.day}`} aria-labelledby="day-title">
          <div className={styles.panelHeader}>
            <div>
              <h2 id="day-title" className={styles.panelTitle}>
                Your day
              </h2>
              <p className={styles.panelSub}>{plannedLabel}</p>
            </div>
            <button className={styles.clearButton} disabled={scheduled.length === 0} onClick={() => setScheduled([])}>
              Clear day
            </button>
          </div>
          <div className={styles['time-grid']} ref={timeGridRef}>
            {HOURS.map((hour) => {
              const event = scheduled.find((a) => a.startHour === hour)
              const covered = isSlotCovered(scheduled, hour)
              return (
                <Fragment key={hour}>
                  <div className={styles['timeLabel']}>{Number.isInteger(hour) ? formatHour(hour) : ''}</div>
                  <HourSlot
                    hour={hour}
                    event={event}
                    stop={event ? stopNumber.get(event.id) : undefined}
                    isCovered={covered}
                    onRemove={handleRemove}
                    onChangeDuration={handleChangeDuration}
                  />
                </Fragment>
              )
            })}
          </div>
        </section>

        <section className={`${styles.panel} ${styles['map-planning']}`} aria-label="Route map">
          {activityList && activityList.length > 0 ? (
            <Map
              center={[activityList[0].longitude, activityList[0].latitude]}
              zoom={15}
              theme={'light'}
              className={styles['map-planning-01']}
            >
              {inPlanLocationCoordinates.length > 1 && (
                <MapRoute coordinates={inPlanLocationCoordinates} color="#1d5fd6" width={4} opacity={0.8} />
              )}
              {stops.map((x, i) => (
                <MapMarker key={x.id} longitude={x.activity.longitude} latitude={x.activity.latitude}>
                  <MarkerContent>
                    <div className={styles.mapPin}>{i + 1}</div>
                  </MarkerContent>
                  <MarkerPopup>{x.activity.name}</MarkerPopup>
                </MapMarker>
              ))}
              <MapControls />
            </Map>
          ) : (
            <div className={styles.mapEmpty}>The map appears once there are activities.</div>
          )}
        </section>
      </div>
    </DragDropProvider>
  )
}
