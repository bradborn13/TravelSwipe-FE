'use client'
import './globals/globals.css'
import Navbar from './navigation/Navigation'
import StoreProvider from './store/StoreProvider'
import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react'
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <StoreProvider>
          <Navbar />
          {children}
        </StoreProvider>
      </body>
    </html>
  )
}
