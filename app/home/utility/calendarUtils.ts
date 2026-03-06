import type { ScheduledActivity } from './calendarTypes'

// 26 half-hour sub-slots: 8, 8.5, 9, 9.5 … 20
export const HOURS = Array.from({ length: 26 }, (_, i) => i * 0.5 + 8)
// Reference height for 1 full hour — event card heights are calculated against this
export const SLOT_HEIGHT = 64

export const formatHour = (h: number): string => {
  const whole = Math.floor(h)
  const minutes = h % 1 !== 0 ? ':30' : ''
  if (whole === 12) return `12${minutes} PM`
  return whole < 12 ? `${whole}${minutes} AM` : `${whole - 12}${minutes} PM`
}

/**
 * Returns true if `hour` falls inside the span of any scheduled event,
 * excluding the event with `excludeId` (used when rescheduling so the
 * event's own old span doesn't block its new position).
 */
export function isSlotCovered(
  scheduled: ScheduledActivity[],
  hour: number,
  excludeId?: string,
): boolean {
  return scheduled.some((e) => {
    if (e.id === excludeId) return false
    // Always block the start slot (event card lives here)
    if (hour === e.startHour) return true
    // Each sub-slot is 0.5h wide, block when event reaches at least the end of this sub-slot
    return hour > e.startHour && e.startHour + e.durationHours >= hour + 0.5
  })
}
