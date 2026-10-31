import { Box, Card, Chip, IconButton, Typography } from '@mui/material'
import { FaHeart, FaShareAlt } from 'react-icons/fa'
import { useState } from 'react'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { Map, MapControls, MapMarker, MarkerContent, MarkerPopup } from '@/components/ui/map'
import { MapPin } from 'lucide-react'
import { Activity, ImageURL } from './types/Activity'
import { ImageCarousel } from './components/ImageCarousel'
import { SkeletonWrapper } from '../components/SkeletonWrapper'
import { categoryTint } from './categoryTint'

const tagChipSx = (name: string) => ({
  ...categoryTint(name),
  height: 26,
  borderRadius: '8px',
  fontSize: '12px',
  fontWeight: 500,
  fontFamily: 'inherit',
})

const ImagePlaceholder = ({ name, category }: { name: string; category?: string }) => {
  const tint = categoryTint(category ?? name ?? '')
  return (
    <div
      className="w-full flex items-center justify-center"
      style={{ height: 290, background: tint.background }}
    >
      <span
        style={{ fontFamily: "'Playfair Display', serif", fontSize: 96, fontWeight: 700, color: tint.color }}
      >
        {name?.[0]}
      </span>
    </div>
  )
}

export const ActivityCard = ({ activity }: { activity: Activity }) => {
  const [flipped, setFlipped] = useState(false)
  const [hover, setHover] = useState(false)
  const FlipButton = () => (
    <Box sx={{ position: 'absolute', top: 12, right: 10 }}>
      <IconButton
        onClick={() => setFlipped(!flipped)}
        aria-label={flipped ? 'Show photos' : 'Show on map'}
        sx={{
          zIndex: 19,
          background: 'rgba(27,29,31,0.72)',
          ':hover': { background: 'var(--primary)' },
        }}
      >
        <OpenInFullIcon sx={{ color: 'white', fontSize: 20 }} />
      </IconButton>
    </Box>
  )

  return (
    <div
      className="w-full h-full flex flex-column items-start"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        transition: hover
          ? 'transform 0.2s, box-shadow 0.2s'
          : 'transform 0.65s cubic-bezier(0.4, 0.2, 0.2, 1)',
        transform: flipped ? 'rotateY(180deg)' : hover ? 'translateY(-3px)' : 'none',
        borderRadius: 'var(--radius-card)',
        background: 'var(--surface)',
        border: `1px solid ${hover ? 'var(--control)' : 'var(--border)'}`,
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
          ) : (
            <ImagePlaceholder name={activity.name} category={activity.categories?.[0]?.name} />
          )}
          <div className="mx-3 mt-2 flex-1 flex flex-column gap-2 justify-between">
            <div className="flex flex-column gap-3 ">
              <SkeletonWrapper variant="rectangular" width={120} height={40} loading={!activity.name}>
                <Typography
                  style={{
                    fontSize: '24px',
                    lineHeight: 1.2,
                    fontWeight: 700,
                    fontFamily: "'Playfair Display', serif",
                  }}
                >
                  {activity.name}
                </Typography>
              </SkeletonWrapper>

              <SkeletonWrapper variant="rectangular" width={120} height={25} loading={!activity.address}>
                <div className="flex items-start gap-1" style={{ color: 'var(--muted-text)' }}>
                  <LocationOnIcon sx={{ fontSize: 18, mt: '2px' }} />
                  <Typography sx={{ fontSize: 14, fontFamily: 'inherit' }}>{activity.address}</Typography>
                </div>
              </SkeletonWrapper>
              <SkeletonWrapper variant="rectangular" width={61} height={32} loading={!activity.categories}>
                <div className="mt-2 mb-3 text-sm flex flex-row flex-wrap  gap-1 ">
                  {activity.categories?.map((cat, index) => (
                    <Chip key={index} label={cat.name} sx={tagChipSx(cat.name)} />
                  ))}
                </div>
              </SkeletonWrapper>
            </div>

            <div className="pt-3 pb-3 flex gap-2 border-t" style={{ borderColor: 'var(--border)' }}>
              <button className="card-action">
                <FaHeart /> Like
              </button>
              <button className="card-action">
                <FaShareAlt /> Share
              </button>
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
                    <MapPin className="fill-black stroke-neutral-500 dark:fill-white" size={28} />
                  </div>
                </MarkerContent>
                <MarkerPopup>{activity.name}</MarkerPopup>
              </MapMarker>
              <MapControls />
            </Map>
          </Card>

          <div className="mx-3 mt-2 flex-1">
            <Typography
              style={{
                fontSize: '24px',
                lineHeight: 1.2,
                fontWeight: 700,
                fontFamily: "'Playfair Display', serif",
              }}
            >
              {activity.name}
            </Typography>
            <div className="flex items-start gap-1" style={{ color: 'var(--muted-text)' }}>
              <LocationOnIcon sx={{ fontSize: 18, mt: '2px' }} />
              <Typography sx={{ fontSize: 14, fontFamily: 'inherit' }}>{activity.address}</Typography>
            </div>
            <div className="mt-2  text-sm flex flex-row flex-wrap  gap-1">
              {activity.categories?.map((cat) => (
                <Chip key={cat.name} label={cat.name} sx={tagChipSx(cat.name)} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
