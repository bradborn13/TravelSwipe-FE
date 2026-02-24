'use client' // This must be a client component to use hooks and localStorage

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function LoginSuccess() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      // 1. Send the token back to the main window (window.opener)
      localStorage.setItem('auth-event', JSON.stringify({ token, time: Date.now() }))
      window.close()
    }
  }, [searchParams])

  return <div className=""></div>
}
