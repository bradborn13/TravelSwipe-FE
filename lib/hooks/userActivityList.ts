import { getActivitiesByCity } from '@/app/services/activitiesService'

export const useActivityList = (city: string) => {
  const { data, isLoading, mutate } = getActivitiesByCity({ city })
  return { activityList: data, loadingActivities: isLoading, mutateActivityList: mutate }
}
