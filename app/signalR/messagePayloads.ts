import { ImageURL } from '../home/types/Activity'

export interface UpdatedActivityImages {
  city: string
  updatedActivities: Record<string, ImageURL[]>
}
