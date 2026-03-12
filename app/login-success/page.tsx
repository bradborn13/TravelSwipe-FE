'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function LoginSuccessInner() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      localStorage.setItem('auth-event', JSON.stringify({ token, time: Date.now() }))
      window.close()
    }
  }, [searchParams])

  return <div className=""></div>
}

export default function LoginSuccess() {
  return (
    <Suspense>
      <LoginSuccessInner />
    </Suspense>
  )
}
