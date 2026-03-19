'use client'

import useSWR from 'swr'
import type { SWRResponse } from 'swr'
import api from './api'
import { Activity } from '../home/types/Activity'

export const fetcher = (url: string) => api.get(url).then((res) => res.data)

export function getActivitiesByCity(params: { city: string }): SWRResponse<Activity[], any> {
  const shouldFetch = params.city.trim() !== ''

  return useSWR(
    shouldFetch ? ['/activities/search', params] : null,
    ([url, params]) => api.get<Activity[]>(url, { params }).then((res) => res.data),
    {
      revalidateOnFocus: false, // don’t fetch on window focus
      revalidateOnReconnect: false, // don’t fetch on network reconnect
      refreshInterval: 0, // don’t auto-refresh
    },
  )
}
export function updateImagesForCityActivities(params: { city: string }) {
  return api.post('/activities/update/images', null, { params })
}
export function getAllCityLocations() {
  return useSWR(['/cities/getAll'], ([url]) => api.get(url).then((res) => res.data), {
    revalidateOnFocus: false, // don’t fetch on window focus
    revalidateOnReconnect: false, // don’t fetch on network reconnect
    refreshInterval: 0, // don’t auto-refresh
  })
}
export function handleLogin() {
  window.location.href = 'http://localhost:5001/auth/google'
}
