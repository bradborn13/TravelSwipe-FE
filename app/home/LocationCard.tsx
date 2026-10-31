'use client'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { getActivitiesByCity } from '../services/activitiesService'
import { CalendarPlanning } from './components/planning/CalendarPlanning'
import { Activity, AppMode } from './types/Activity'
import { ActivityList } from './ActivityList'
import { Button, Typography } from '@mui/material'
import { clearRehydrate } from '../store/slices/searchSlice'
import { HubConnection } from '@microsoft/signalr'
import { signalRService } from '../signalR/signalrService'
import { UpdatedActivityImages } from '../signalR/messagePayloads'

export function LocationCard() {
  const query = useAppSelector((state) => state.base.search)
  const dispatch = useAppDispatch()
  const shouldRehydrateSearch = useAppSelector((state) => state.base.rehydrateSearch)
  const [mode, setMode] = useState(AppMode.Listing)
  const [newMessage, setNewMessage] = useState('')
  // search starts as '' (not null), so fall back on any empty value
  const city = query || 'Aarhus'
  const {
    data: activitiesByLocation,
    isLoading: loadingActivities,
    mutate: mutateActivityList,
  } = getActivitiesByCity({ city })
  const [activityList, setActivityList] = useState<Activity[]>([])

  useEffect(() => {
    if (activitiesByLocation && activitiesByLocation.length > 0) {
      setActivityList(activitiesByLocation)
    }
  }, [activitiesByLocation])

  const connectionRef = useRef<HubConnection | null>(null)

  useEffect(() => {
    if (shouldRehydrateSearch) {
      mutateActivityList().finally(() => dispatch(clearRehydrate()))
    }
  }, [shouldRehydrateSearch])

  // turn on if you want to use signalR hub
  useEffect(() => {
    signalRService.connect()

    const handleUpdatedImages = (images: UpdatedActivityImages) => {
      setActivityList((prev) =>
        prev?.map((activity) => {
          const matchingUpdate = images.updatedActivities[activity.name]
          return matchingUpdate ? { ...activity, imagesURL: matchingUpdate } : activity
        }),
      )
    }
    signalRService.onMessage('UpdatedImagesForActivities', handleUpdatedImages)
    return () => signalRService.offMessage('UpdatedImagesForActivities', handleUpdatedImages)
  }, [])

  // const sendMessage = async () => {
  //   const conn = connectionRef.current
  //   if (conn && conn.state === 'Connected' && newMessage.trim()) {
  //     try {
  //       await conn.send('PostMessage', newMessage)
  //       setNewMessage('')
  //     } catch (e) {
  //       console.error('Send failed', e)
  //     }
  //   }
  // }

  // segmented track: neutral grey; the white pill behind the active option slides between them
  const modeButtonSx = (active: boolean) => ({
    position: 'relative',
    zIndex: 1,
    background: 'transparent',
    color: active ? 'var(--text)' : 'var(--muted-text)',
    borderRadius: 40,
    height: 32,
    px: 2,
    fontSize: 14,
    fontWeight: 600,
    fontFamily: 'inherit',
    textTransform: 'none',
    whiteSpace: 'nowrap',
    transition: 'color 0.2s ease',
    '&:hover': { background: 'transparent', color: 'var(--text)' },
  })

  // the tabs sit in enum order, so the new view slides in from the side the pill moves toward
  const [slideFrom, setSlideFrom] = useState<'left' | 'right' | null>(null)
  const switchMode = (next: AppMode) => {
    if (next === mode) return
    setSlideFrom(next > mode ? 'right' : 'left')
    setMode(next)
  }

  const tabRefs = useRef<Record<AppMode, HTMLButtonElement | null>>({} as Record<AppMode, HTMLButtonElement | null>)
  const tabListRef = useRef<HTMLDivElement>(null)
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null)
  useLayoutEffect(() => {
    const measure = () => {
      const el = tabRefs.current[mode]
      if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth })
    }
    measure()
    // re-measure when the web font lands or the layout wraps
    const observer = new ResizeObserver(measure)
    if (tabListRef.current) observer.observe(tabListRef.current)
    return () => observer.disconnect()
  }, [mode])

  return (
    <>
      <div
        className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4"
        style={{ marginTop: 32, padding: '0 var(--gutter)' }}
      >
        <div>
          <Typography
            variant="h1"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: 26, sm: 32 },
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
              color: 'var(--text)',
              fontWeight: 700,
            }}
          >
            Exploring {city[0].toUpperCase() + city.slice(1).toLowerCase()}
          </Typography>
          <Typography
            className="num"
            sx={{ mt: 0.5, color: 'var(--muted-text)', fontSize: 14, fontFamily: 'inherit' }}
          >
            {loadingActivities ? 'Finding things to do…' : `${activityList?.length ?? 0} things to do`}
          </Typography>
        </div>
        <div ref={tabListRef} role="tablist" aria-label="View" className="mode-tabs">
          {pill ? (
            <span
              className="mode-pill"
              aria-hidden="true"
              style={{ width: pill.width, transform: `translateX(${pill.left}px)` }}
            />
          ) : null}
          <Button
            ref={(el) => {
              tabRefs.current[AppMode.Listing] = el
            }}
            role="tab"
            aria-selected={mode === AppMode.Listing}
            sx={modeButtonSx(mode === AppMode.Listing)}
            onClick={() => switchMode(AppMode.Listing)}
          >
            Activities
          </Button>
          <Button
            ref={(el) => {
              tabRefs.current[AppMode.Planning] = el
            }}
            role="tab"
            aria-selected={mode === AppMode.Planning}
            sx={modeButtonSx(mode === AppMode.Planning)}
            onClick={() => switchMode(AppMode.Planning)}
          >
            Planning
          </Button>
        </div>
      </div>

      {/* keyed on the mode so the incoming view replays its entrance */}
      <div
        key={mode}
        className={`flex flex-column gap-4 ${slideFrom ? `view-from-${slideFrom}` : ''}`}
        style={{ marginTop: 24 }}
      >
        {mode === AppMode.Listing ? (
          <ActivityList activityList={activityList} />
        ) : (
          <CalendarPlanning activityList={activityList} />
        )}
      </div>
    </>
  )
}
