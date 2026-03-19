import Carousel from 'react-bootstrap/esm/Carousel'
import { ImageURL } from '../types/Activity'
import Image from 'next/image'
import { Box } from '@mui/material'

export const ImageCarousel = ({ images }: { images: ImageURL[] }) => {
  return (
    <Box style={{ perspective: '1200px' }}>
      <Carousel interval={null}>
        {images.map((img, index) =>
          img.link && !img.link.includes('lookaside') ? (
            <Carousel.Item key={index}>
              <Box sx={{ width: '100%', height: 290, overflow: 'hidden' }}>
                <Image
                  width={400}
                  height={290}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  src={
                    img.thumbnail ??
                    'https://media.istockphoto.com/id/887464786/vector/no-cameras-allowed-sign-flat-icon-in-red-crossed-out-circle-vector.jpg?s=612x612&w=0&k=20&c=LVkPMBiZas8zxBPmhEApCv3UiYjcbYZJsO-CVQjAJeU='
                  }
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src =
                      'https://media.istockphoto.com/id/887464786/vector/no-cameras-allowed-sign-flat-icon-in-red-crossed-out-circle-vector.jpg?s=612x612&w=0&k=20&c=LVkPMBiZas8zxBPmhEApCv3UiYjcbYZJsO-CVQjAJeU='
                  }}
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
