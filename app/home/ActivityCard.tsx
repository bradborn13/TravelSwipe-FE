import { Box, Card, Chip, IconButton, Skeleton, Typography } from '@mui/material'
import { FaHeart, FaShareAlt } from 'react-icons/fa'
import { useState } from 'react'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { Map, MapControls, MapMarker, MarkerContent, MarkerPopup } from '@/components/ui/map'
import { MapPin } from 'lucide-react'
import { Activity, ImageURL } from './types/Activity'
import { ImageCarousel } from './components/ImageCarousel'
import { SkeletonWrapper } from '../components/SkeletonWrapper'

export const ActivityCard = ({ activity }: { activity: Activity }) => {
  const [flipped, setFlipped] = useState(false)
  const [hover, setHover] = useState(false)
  const FlipButton = () => (
    <Box sx={{ position: 'absolute', top: 12, right: 10 }}>
      <IconButton
        onClick={() => setFlipped(!flipped)}
        sx={{
          zIndex: 19,
          background: 'grey',
          ':hover': {
            bgcolor: 'primary.main',
            color: 'white',
          },
        }}
      >
        <OpenInFullIcon sx={{ color: 'white' }} />
      </IconButton>
    </Box>
  )

  return (
    <div
      className="w-98 rounded-lg shadow-lg flex flex-column items-start "
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        transition: hover
          ? 'transform 0.2s, box-shadow 0.2s'
          : 'transform 0.65s cubic-bezier(0.4, 0.2, 0.2, 1)',
        transform: flipped ? 'rotateY(180deg)' : hover ? 'translateY(-4px)' : 'none',
        borderRadius: flipped ? '25px 53px  23px 53px' : '25px 43px 53px 23px',
        boxShadow: hover ? '0 12px 32px rgba(0,0,0,0.09)' : '0 2px 8px rgba(0,0,0,0.04)',
        overflow: 'hidden',
      }}
    >
      {!flipped ? (
        <div
          style={{
            backfaceVisibility: 'hidden',
            width: 'inherit',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <FlipButton />

          {activity.imagesURL && activity.imagesURL.length > 0 ? (
            <SkeletonWrapper variant="rectangular" width={'100%'} height={290} loading={!activity.imagesURL}>
              <ImageCarousel images={activity.imagesURL} />
            </SkeletonWrapper>
          ) : null}
          <div className="mx-3 mt-2 flex-1 flex flex-column gap-2 justify-between">
            <div className="flex flex-column gap-3 ">
              <SkeletonWrapper variant="rectangular" width={120} height={40} loading={!activity.name}>
                <Typography style={{ fontSize: '27px', fontWeight: 700, fontFamily: 'Playfair Display' }}>
                  {activity.name}
                </Typography>
              </SkeletonWrapper>

              <SkeletonWrapper variant="rectangular" width={120} height={25} loading={!activity.address}>
                <div className="text-sm text-gray-400 flex justify-start align-middle">
                  <LocationOnIcon />
                  <Typography>{activity.address}</Typography>
                </div>
              </SkeletonWrapper>
              <SkeletonWrapper variant="rectangular" width={61} height={32} loading={!activity.categories}>
                <div className="mt-2 mb-3 text-sm flex flex-row flex-wrap  gap-1 ">
                  {activity.categories?.map((cat, index) => (
                    <Chip
                      key={index}
                      label={cat.name}
                      sx={{ color: '#FF5C35', fontSize: '11px', fontWeight: 500, background: '##EDEAE4' }}
                    />
                  ))}
                </div>
              </SkeletonWrapper>
            </div>

            <div className="py-2 flex gap-3 b-0 ">
              {activity ? (
                <button className="flex items-center gap-1 hover:text-red-400 transition">
                  <FaHeart /> Like
                </button>
              ) : (
                <Skeleton variant="rectangular" width={61} height={32} />
              )}
              {activity ? (
                <button className="flex items-center gap-1 hover:text-blue-400 transition">
                  <FaShareAlt /> Share
                </button>
              ) : (
                <Skeleton variant="rectangular" width={61} height={32} />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            transform: 'rotateY(180deg)',
          }}
        >
          <FlipButton />
          <Card style={{ height: '300px' }}>
            <Map center={[activity.longitude, activity.latitude]} zoom={15} theme={'light'}>
              <MapMarker longitude={activity.longitude} latitude={activity.latitude}>
                <MarkerContent>
                  <div className="cursor-move">
                    <MapPin className="fill-black stroke-white dark:fill-white" size={28} />
                  </div>
                </MarkerContent>
                <MarkerPopup>{activity.name}</MarkerPopup>
              </MapMarker>
              <MapControls />
            </Map>
          </Card>

          <div className="mx-3 mt-2 flex-1">
            <Typography style={{ fontSize: '27px', fontWeight: 700, fontFamily: 'Playfair Display' }}>
              {activity.name}
            </Typography>
            <div className="text-sm text-gray-400 flex justify-start ">
              <LocationOnIcon />
              <Typography
                sx={{ color: '#8A8F9E', fontWeight: 300, fontFamily: 'DM Sans', fontStyle: 'normal' }}
              >
                {activity.address}
              </Typography>
            </div>
            <div className="mt-2  text-sm flex flex-row flex-wrap  gap-1">
              {activity.categories?.map((cat) => (
                <Chip
                  key={cat.id}
                  label={cat.name}
                  sx={{ color: '#FF5C35', fontSize: '11px', fontWeight: 500, background: '##EDEAE4' }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
