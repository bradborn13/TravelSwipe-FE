'use client'
import './globals/globals.css'
import Navbar from './navigation/Navigation'
import StoreProvider from './store/StoreProvider'
import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react'
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300..700&family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap"
        />
      </head>
      <body>
        <StoreProvider>
          <Navbar />
          {children}
        </StoreProvider>
      </body>
    </html>
  )
}
