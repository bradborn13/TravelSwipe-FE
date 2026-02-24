'use client'
import { useCallback, useState } from 'react'
import { useAppSelector } from '../store/hooks'
import { Box } from '@mui/material'
import { Button, CircularProgress } from '@mui/material'
import { green } from '@mui/material/colors'
import { DragDropProvider } from '@dnd-kit/react'
import { useDraggable } from '@dnd-kit/react'
import { useDroppable } from '@dnd-kit/react'
import { getActivitiesByCity, updateImagesForCityActivities } from '../services/activitiesService'
import { RestrictToElement } from '@dnd-kit/dom/modifiers'
import { ActivityCard } from './ActivityCard'
export default function LocationCard() {
  const query = useAppSelector((state) => state.base.search)
  // const [activities, setActivities] = useState({ data: [], loading: false })

  // eslint-disable-next-line react/prop-types
  function Droppable({ id, children }) {
    const { ref } = useDroppable({
      id,
      modifiers: [RestrictToElement.configure({ element: document.body })],
    })

    return (
      <div ref={ref} style={{ width: 300, height: 300, background: 'yellow' }}>
        {children}
      </div>
    )
  }
  function Draggable() {
    const { ref } = useDraggable({
      id: 'draggable',
    })

    return <button ref={ref}>Draggable</button>
  }

  const [isDropped, setIsDropped] = useState(false)

  const {
    data: activityList,
    isLoading: loadingActivities,
    mutate: mutateActivityList,
  } = getActivitiesByCity({ city: query })
  const handleUpdateActivityImages = useCallback(async () => {
    try {
      console.log('Updating images for city:', query)
      await updateImagesForCityActivities({ city: query }).then(async () => {
        mutateActivityList()
      })
    } catch (err) {
      console.error('Error updating activity images:', err)
    }
  }, [query])

  // useEffect(() => {
  //   async function fetchLocationEvents() {
  //     setActivities((prev) => ({ ...prev, loading: true }))
  //     try {
  //       const response = await getActivitiesByCity({ city: query })
  //       const data = Array.isArray(response.data) ? response.data : []
  //       setActivities((prev) => ({ ...prev, data: data }))
  //     } catch (err) {
  //       console.error('Error fetching events:', err)
  //     } finally {
  //       setActivities((prev) => ({ ...prev, loading: false }))
  //     }
  //   }

  //   if (query) {
  //     fetchLocationEvents()
  //   }
  // }, [query])
  return (
    <div className="p-4 ">
      <div className="text-gray-400 text-sm mb-2 justify-center flex gap-3">
        City: {query} - found {activityList?.length ?? 0} events
      </div>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {activityList?.length > 0 && (
          <Box sx={{ m: 1, position: 'relative' }}>
            <Button
              variant="contained"
              sx={
                loadingActivities && {
                  bgcolor: green[500],
                  '&:hover': {
                    bgcolor: green[700],
                  },
                }
              }
              disabled={loadingActivities}
              onClick={async () => await handleUpdateActivityImages()}
            >
              Update Images
            </Button>

            {loadingActivities && (
              <CircularProgress
                size={24}
                sx={{
                  color: green[500],
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </Box>
        )}
      </Box>
      <div className="flex gap-5 flex-row justify-start flex-wrap ">
        {activityList?.length > 0 ? (
          <>
            {activityList.map((activity, index) => (
              <ActivityCard activity={activity} key={index}></ActivityCard>
            ))}
            <div className="bg-black">
              <DragDropProvider
                onDragEnd={(event) => {
                  if (event.canceled) return

                  const { target } = event.operation
                  setIsDropped(target?.id === 'droppable')
                }}
              >
                {!isDropped && <Draggable />}

                <Droppable id="droppable">{isDropped && <Draggable />}</Droppable>
              </DragDropProvider>
            </div>
          </>
        ) : (
          <p className="text-gray-400 mt-5">No events found for this location.</p>
        )}
      </div>
    </div>
  )
}
