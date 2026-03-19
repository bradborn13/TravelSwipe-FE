import { Activity } from '../../../types/Activity'
export interface ScheduledActivity {
  id: string
  name: string
  startHour: number
  durationHours: number
  color: string
  activity: Activity
}
