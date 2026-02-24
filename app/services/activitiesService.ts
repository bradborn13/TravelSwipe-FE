// lib/api.ts
import useSWR from 'swr'
import api from './api'

export const fetcher = (url: string) => api.get(url).then((res) => res.data)

export function getActivitiesByCity(params: { city: string }) {
  const shouldFetch = params.city.trim() !== ''

  return useSWR(shouldFetch ? ['/activities/search', params] : null, ([url, params]) =>
    api.get(url, { params }).then((res) => res.data),
  )
}
export function updateImagesForCityActivities(params: { city: string }) {
  return api.post('/activities/update/images', null, { params })
}
export function getAllCityLocations() {
  return useSWR(['/city/getAll'], ([url]) => api.get(url).then((res) => res.data))
}
export function handleLogin() {
  window.location.href = 'http://localhost:5001/auth/google'
}
