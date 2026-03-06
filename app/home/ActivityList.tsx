import { useState, useEffect } from 'react'
import { useAppSelector } from '../store/hooks'
import { Typography, Chip, Box } from '@mui/material'
import { ActivityCard } from './ActivityCard'
import { Activity } from './types/Activity'

export function ActivityList({ activityList }: { activityList?: Activity[] }) {
  const query = useAppSelector((state) => state.base.search)
  const [filterByTag, setTag] = useState('')
  useEffect(() => {
    setTag('')
  }, [query])
  return (
    <>
      {/* <Box style={{ display: 'flex', alignItems: 'center' }}>
        {activityList?.length > 0 && (
        //   <Box sx={{ m: 1, position: 'relative' }}>
        //     <Button
        //       variant="contained"
        //       disabled={loadingActivities}
        //       onClick={async () => await handleUpdateActivityImages()}
        //     >
        //       Update Images
        //     </Button>

        //     {loadingActivities && (
        //       <CircularProgress
        //         size={24}
        //         sx={{
        //           color: green[500],
        //           position: 'absolute',
        //           top: '50%',
        //           left: '50%',
        //           marginTop: '-12px',
        //           marginLeft: '-12px',
        //         }}
        //       />
        //     )}
        //   </Box>
        )}
      </Box> */}
      <div className="flex flex-row gap-2 flex-wrap mx-3">
        <Chip
          label={'All'}
          sx={{
            color: '#FF5C35',
            fontSize: '11px',
            fontWeight: 500,
            background: '##EDEAE4',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
          onClick={() => setTag('')}
        />
        {activityList &&
          activityList &&
          activityList?.length > 0 &&
          Array.from(
            new Map(
              activityList.flatMap((x) => x.categories).map((item) => [item.id, item]), // Map uses ID as key to overwrite duplicates
            ).values(),
          ).map((z: any) => (
            <Chip
              key={z.id}
              label={z.name}
              sx={{ color: '#FF5C35', fontSize: '11px', fontWeight: 500, background: '##EDEAE4' }}
              onClick={() => setTag(z.name)}
            />
          ))}
      </div>
      <div className="flex flex-row justify-center flex-wrap gap-10  mb-5">
        {activityList && activityList?.length > 0 ? (
          activityList.map((activity, index) =>
            filterByTag ? (
              activity.categories.find((x) => x.name === filterByTag) ? (
                <ActivityCard activity={activity} key={index}></ActivityCard>
              ) : null
            ) : (
              <ActivityCard activity={activity} key={index}></ActivityCard>
            ),
          )
        ) : (
          <p className="text-gray-400 mt-5">No events found for this location.</p>
        )}
      </div>
    </>
  )
}
