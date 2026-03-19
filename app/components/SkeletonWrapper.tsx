import { Skeleton } from '@mui/material'
import React from 'react'
interface Props {
  loading: boolean
  width?: number | string
  height?: number | string
  variant?: 'text' | 'rectangular' | 'rounded' | 'circular'
  children: React.ReactNode
}

export function SkeletonWrapper({ loading, width, height, variant = 'rounded', children }: Props) {
  if (loading) return <Skeleton variant={variant} width={width} height={height} />
  return <>{children}</>
}
