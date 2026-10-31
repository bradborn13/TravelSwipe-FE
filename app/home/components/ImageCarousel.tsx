import Carousel from 'react-bootstrap/esm/Carousel'
import { ImageURL } from '../types/Activity'
import Image from 'next/image'
import { Box } from '@mui/material'

export const ImageCarousel = ({ images }: { images: ImageURL[] }) => {
  return (
    <Box style={{ perspective: '1200px' }}>
      <Carousel interval={null}>
        {images.map((img, index) =>
          img.thumbnail && !img.thumbnail.includes('lookaside') ? (
            <Carousel.Item key={index}>
              <Box sx={{ width: '100%', height: 290, overflow: 'hidden' }}>
                <Image
                  width={400}
                  height={290}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  src={img.thumbnail}
                  onError={(e) => {}}
                  alt={`Slide ${index + 1}`}
                  style={{ width: '100%', height: '100%' }}
                  unoptimized
                />
              </Box>
            </Carousel.Item>
          ) : null,
        )}
      </Carousel>
    </Box>
  )
}
