import Carousel from 'react-bootstrap/Carousel'
import { Box, Chip, IconButton } from '@mui/material'
import { FaHeart, FaShareAlt } from 'react-icons/fa'
import Image from 'next/image'
import { useState } from 'react'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'

export const ActivityCard = ({ activity }: { activity: any }) => {
  const [minimize, setExpanded] = useState<boolean>(false)
  function ImageCarousel(images: any) {
    return (
      <Carousel data-bs-theme="dark" interval={null}>
        {images.map((img, index) => (
          <Carousel.Item key={index}>
            <Image
              width={0}
              height={0}
              sizes="130vw"
              src={
                img.image ??
                'https://media.istockphoto.com/id/887464786/vector/no-cameras-allowed-sign-flat-icon-in-red-crossed-out-circle-vector.jpg?s=612x612&w=0&k=20&c=LVkPMBiZas8zxBPmhEApCv3UiYjcbYZJsO-CVQjAJeU='
              }
              alt={`Slide ${index + 1}`}
              style={{ width: '100%', height: '300px', objectFit: 'cover' }}
              unoptimized
            />
          </Carousel.Item>
        ))}
      </Carousel>
    )
  }

  return (
    <div className="w-120 h-auto bg-gray-800 text-white rounded-xl shadow-lg relative flex flex-column items-start">
      <Box className="w-100">
        <Box sx={{ position: 'absolute', top: 12, right: 10 }}>
          <IconButton
            aria-label="fingerprint"
            color="secondary"
            onClick={() => setExpanded(!minimize)}
            sx={{ zIndex: 19 }}
          >
            <OpenInFullIcon sx={{ color: 'white' }} />
          </IconButton>
        </Box>
        {activity.imagesURL && activity.imagesURL.length > 0
          ? minimize
            ? null
            : ImageCarousel(activity.imagesURL)
          : null}

        <div className="m-4">
          <h2 className="text-lg font-bold">{activity.name}</h2>
          <div className="text-sm text-gray-400">{activity.address}</div>
          <div className="mt-2 text-gray-200 text-sm flex flex-row flex-wrap  gap-1">
            TAGS:
            <div className="w-full" />
            {activity.categories?.map((cat: any) => (
              <Chip key={cat.id} label={cat.name} className="mr-2 w-max" color="warning" />
            ))}
          </div>
        </div>
        <div className="px-4 py-2 flex gap-2 border-t border-gray-700 ">
          <button className="flex items-center gap-1 hover:text-red-400 transition">
            <FaHeart /> Like
          </button>
          <button className="flex items-center gap-1 hover:text-blue-400 transition">
            <FaShareAlt /> Share
          </button>
        </div>
      </Box>
    </div>
  )
}
