import { useState, useEffect } from 'react'
import { useAppSelector } from '../store/hooks'
import { Chip } from '@mui/material'
import { ActivityCard } from './ActivityCard'
import { Activity } from './types/Activity'

const filterChipSx = (active: boolean) => ({
  height: 32,
  color: active ? 'var(--white)' : 'var(--text)',
  background: active ? 'var(--primary)' : 'var(--surface)',
  border: '1px solid',
  borderColor: active ? 'var(--primary)' : 'var(--border)',
  fontSize: '14px',
  fontWeight: 500,
  fontFamily: 'inherit',
  flexShrink: 0,
  '&:hover': {
    background: active ? 'var(--primary)' : 'var(--active)',
    borderColor: active ? 'var(--primary)' : 'var(--control)',
  },
})

export function ActivityList({ activityList }: { activityList?: Activity[] }) {
  const SearchValue = useAppSelector((state) => state.base.search)
  const [filterByTag, setTag] = useState('')
  useEffect(() => {
    setTag('')
  }, [SearchValue])

  const categoryNames = Array.from(
    new Set(activityList?.flatMap((x) => x.categories.map((c) => c.name)) ?? []),
  )
  const visibleActivities =
    activityList?.filter(
      (activity) => !filterByTag || activity.categories.some((x) => x.name === filterByTag),
    ) ?? []

  return (
    <div style={{ padding: '0 var(--gutter)' }}>
      <div className="filter-chips">
        <Chip label="All" sx={filterChipSx(filterByTag === '')} onClick={() => setTag('')} />
        {categoryNames.map((name) => (
          <Chip
            key={name}
            label={name}
            sx={filterChipSx(filterByTag === name)}
            onClick={() => setTag((prev) => (prev === name ? '' : name))}
          />
        ))}
      </div>
      {visibleActivities.length > 0 ? (
        <div
          className="grid gap-8 grid-cols-[repeat(auto-fill,minmax(min(100%,420px),1fr))]"
          style={{ marginBottom: 40 }}
        >
          {visibleActivities.map((activity) => (
            <ActivityCard activity={activity} key={activity.name}></ActivityCard>
          ))}
        </div>
      ) : (
        <p
          className="mt-2"
          style={{
            color: 'var(--muted-text)',
            border: '1px dashed var(--control)',
            borderRadius: 'var(--radius-control)',
            padding: '12px 16px',
          }}
        >
          Nothing to do found here yet. Try another city.
        </p>
      )}
    </div>
  )
}
