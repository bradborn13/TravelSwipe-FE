'use client'
import { useCallback, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { getActivitiesByCity, updateImagesForCityActivities } from '../services/activitiesService'
import { CalendarPlanning } from './components/planning/CalendarPlanning'
import { AppMode } from './types/Activity'
import { ActivityList } from './ActivityList'
import { Box, Button, Chip, Typography } from '@mui/material'
import { clearRehydrate } from '../store/slices/searchSlice'

export function LocationCard() {
  const query = useAppSelector((state) => state.base.search)
  const dispatch = useAppDispatch()
  const shouldRehydrateSearch = useAppSelector((state) => state.base.rehydrateSearch)
  const [mode, setMode] = useState(AppMode.Listing)

  const {
    data: activityList,
    isLoading: loadingActivities,
    mutate: mutateActivityList,
  } = getActivitiesByCity({ city: query ?? 'aarhus' })

  useEffect(() => {
    if (shouldRehydrateSearch) {
      mutateActivityList().finally(() => dispatch(clearRehydrate()))
    }
  }, [shouldRehydrateSearch])

  return (
    <>
      <div className="text-gray-400 text-sm mt-5  justify-between flex gap-3">
        {query ? (
          <>
            <Typography
              variant="h1"
              sx={{
                paddingLeft: 5,
                display: 'flex',
                flexDirection: 'row',
                gap: 1,
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                fontSize: '38px',
                color: '#1C2536',
                fontWeight: 700,
              }}
            >
              Exploring
              <Box
                component="span"
                sx={{
                  fontStyle: 'italic',
                  color: '#FF5C35',
                  fontWeight: 700,
                }}
              >
                {query[0].toUpperCase() + query.substr(1).toLowerCase()}
              </Box>
            </Typography>
            <div className="flex flex-columns  justify-center ">
              <div
                style={{
                  display: 'inline-flex',
                  background: '#1a1a2e',
                  borderRadius: 50,
                  padding: 5,
                  gap: 4,
                  marginBottom: 28,
                  boxShadow: '0 4px 24px rgba(26,26,46,0.15)',
                }}
              >
                <Button
                  variant="text"
                  style={{
                    background: mode === AppMode.Listing ? '#e8521a' : 'transparent',
                    color: mode === AppMode.Listing ? '#fff' : 'rgba(255,255,255,0.5)',
                    border: 'none',
                    borderRadius: 40,
                    fontSize: 14,
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'all 0.25s ease',
                    letterSpacing: '0.9px',
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    textTransform: 'none',
                    lineHeight: 1.6,
                    whiteSpace: 'nowrap',
                  }}
                  onClick={() => setMode(AppMode.Listing)}
                >
                  Activities
                </Button>
                <Button
                  variant="text"
                  style={{
                    background: mode === AppMode.Planning ? '#e8521a' : 'transparent',
                    color: mode === AppMode.Planning ? '#fff' : 'rgba(255,255,255,0.5)',
                    border: 'none',
                    borderRadius: 40,
                    fontSize: 14,
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'all 0.25s ease',
                    letterSpacing: '0.9px',
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    lineHeight: 1.6,
                  }}
                  onClick={() => setMode(AppMode.Planning)}
                >
                  Planning
                </Button>
              </div>
            </div>
            <Typography mr={3}> {activityList?.length ?? 0} activities found </Typography>
          </>
        ) : null}
      </div>

      <div className="mt-4 flex flex-column gap-4">
        {mode === AppMode.Listing ? (
          <ActivityList activityList={activityList} />
        ) : (
          <CalendarPlanning activityList={activityList} />
        )}
      </div>
    </>
  )
}
