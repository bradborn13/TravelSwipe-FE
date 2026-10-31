'use client'

import { Snackbar, Alert } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { FaFacebook, FaGoogle } from 'react-icons/fa'
import { login, register } from '../../services/authService'
import PersonPinIcon from '@mui/icons-material/PersonPin'

// Bootstrap's reboot and the global `* { margin: 0; padding: 0 }` reset are unlayered, so they beat
// Tailwind's layered utilities: spacing, and the font-size/radius/display Bootstrap sets on these
// elements, carry `!` to win
const labelClass = 'mb-1.5! block! text-[13px] font-medium text-(--text)'
const inputClass =
  'h-11 w-full rounded-(--radius-control)! border border-(--control) bg-(--surface) px-3.5! text-sm! text-(--text) outline-none transition-shadow placeholder:text-(--muted) hover:border-[#b9bdc3] focus:border-(--text) focus:shadow-[0_0_0_4px_rgba(27,29,31,0.06)]'
const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--text)'
const socialButtonClass = `flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full! border border-(--control) bg-(--surface) text-sm! font-medium text-(--text) transition-colors hover:border-[#b9bdc3] hover:bg-(--active) ${focusRing}`

enum AuthOption {
  Login = 1,
  Register = 2,
}

export interface AuthForm {
  email: string
  password: string
  fullname?: string
}
export default function Login() {
  const width = 500
  const height = 600
  const [modalOpen, setModalOpen] = useState(false)
  const [notification, setNotification] = useState<{ isOpen: boolean; message: string; type: string }>({
    isOpen: false,
    message: '',
    type: '',
  })
  const popupRef = useRef<Window | null>(null)
  const [authOption, setAuthOption] = useState<AuthOption>(AuthOption.Register)
  const [authForm, updateAuthForm] = useState<AuthForm>({ email: '', password: '', fullname: '' })
  const [userIsLogged, setUserIsLogged] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)

  // a native <dialog> as a modal: it traps focus, closes on Esc and draws its own backdrop
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (modalOpen && !dialog.open) dialog.showModal()
    if (!modalOpen && dialog.open) dialog.close()
  }, [modalOpen])

  useEffect(() => {
    const messageListener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return

      if (event.data.type === 'AUTH_SUCCESS') {
        const token = event.data.token
        localStorage.setItem('token', token)

        if (popupRef.current) {
          popupRef.current.close()
        }
        setModalOpen(false)
      }
    }

    window.addEventListener('message', messageListener)
    return () => window.removeEventListener('message', messageListener)
  }, [])

  async function handleUserAuth(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log(authForm)
    try {
      switch (authOption) {
        case AuthOption.Login: {
          await login({ email: authForm.email, password: authForm.password })

          break
        }
        case AuthOption.Register: {
          await register({
            email: authForm.email,
            password: authForm.password,
            fullname: authForm.fullname ?? '',
          })

          break
        }
      }
      setNotification({ isOpen: true, message: 'Welcome Back', type: 'success' })
      setUserIsLogged(true)
      setModalOpen(!modalOpen)
      updateAuthForm({ email: '', password: '', fullname: '' })
    } catch (err: any) {
      setNotification({ isOpen: true, message: err.message, type: 'error' })
    }
  }
  const googleAuth = () => {
    const left = window.screenX + (window.innerWidth - width) / 2
    const top = window.screenY + (window.innerHeight - height) / 2

    popupRef.current = window.open(
      'http://localhost:5001/auth/google',
      'google-auth',
      `width=${width},height=${height},left=${left},top=${top}`,
    )
  }

  function handleAuth() {
    if (userIsLogged) {
      const isTokenFound = localStorage.getItem('token')
      const isAutToken = localStorage.getItem('auth-event')
      if (isTokenFound) {
        localStorage.removeItem('token')
      }
      if (isAutToken) {
        localStorage.removeItem('auth-event')
      }
      setUserIsLogged(false)
    } else {
      setModalOpen(!modalOpen)
    }
  }

  useEffect(() => {
    const isTokenFound = localStorage.getItem('token')
    const isAuthToken = localStorage.getItem('auth-event')

    setUserIsLogged((!!isTokenFound && isTokenFound.length > 0) || (!!isAuthToken && isAuthToken.length > 0))
  }, [])
  return (
    <div>
      <button
        onClick={handleAuth}
        className="btn-icon"
        aria-label={userIsLogged ? 'Sign out' : 'Sign in'}
        aria-pressed={userIsLogged}
        title={userIsLogged ? 'Sign out' : 'Sign in'}
      >
        <PersonPinIcon className="text-[20px]!" />
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="auth-title"
        onClose={() => setModalOpen(false)}
        // a click on the backdrop lands on the dialog element itself
        onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
        className="m-auto! w-[calc(100%-32px)] max-w-[400px] rounded-(--radius-card) bg-(--surface) p-0! text-(--text) shadow-[0_24px_64px_rgba(27,29,31,0.18)] backdrop:bg-[rgba(27,29,31,0.4)]"
      >
        <div className="relative px-7! pt-8! pb-6!">
          <button
            type="button"
            onClick={() => setModalOpen(false)}
            aria-label="Close"
            className={`absolute top-3.5 right-3.5 flex size-8 cursor-pointer items-center justify-center rounded-full! text-(--muted) transition-colors hover:bg-(--active) hover:text-(--text) ${focusRing}`}
          >
            <X size={18} />
          </button>

          <h2
            id="auth-title"
            className="m-0! font-['Playfair_Display',serif] text-[28px]! leading-[1.2]! font-bold! tracking-[-0.01em] text-(--text)!"
          >
            {authOption === AuthOption.Register ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="mt-1.5! mb-6! text-sm text-(--muted-text)">
            {authOption === AuthOption.Register
              ? 'Save activities and plan your days.'
              : 'Log in to pick up where you left off.'}
          </p>

          {/* one form around the fields, so Enter in any of them submits */}
          <form onSubmit={handleUserAuth} className="flex flex-col gap-3.5">
            {authOption === AuthOption.Register && (
              <div>
                <label htmlFor="auth-fullname" className={labelClass}>
                  Full name
                </label>
                <input
                  id="auth-fullname"
                  autoComplete="name"
                  value={authForm.fullname}
                  onChange={(e) => updateAuthForm((prev) => ({ ...prev, fullname: e.target.value }))}
                  placeholder="Your name"
                  className={inputClass}
                />
              </div>
            )}

            <div>
              <label htmlFor="auth-email" className={labelClass}>
                Email
              </label>
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                value={authForm.email}
                onChange={(e) => updateAuthForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="auth-password" className={labelClass}>
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                autoComplete={authOption === AuthOption.Register ? 'new-password' : 'current-password'}
                value={authForm.password}
                onChange={(e) => updateAuthForm((prev) => ({ ...prev, password: e.target.value }))}
                placeholder={authOption === AuthOption.Register ? 'Create a password' : 'Your password'}
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              className={`mt-1.5! h-11 w-full cursor-pointer rounded-full! bg-(--primary) text-[15px]! font-semibold text-(--white) transition-colors hover:bg-black ${focusRing}`}
            >
              {authOption === AuthOption.Register ? 'Create account' : 'Log in'}
            </button>
          </form>

          <div className="my-5! flex items-center gap-3 text-xs text-(--muted) before:h-px before:flex-1 before:bg-(--border) after:h-px after:flex-1 after:bg-(--border)">
            or continue with
          </div>

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => {
                googleAuth()
              }}
              className={socialButtonClass}
            >
              <FaGoogle size={16} /> Google
            </button>
            <button
              type="button"
              onClick={() => {
                /* Your fbAuth logic */
              }}
              className={socialButtonClass}
            >
              <FaFacebook size={16} /> Facebook
            </button>
          </div>

          <p className="mt-5! text-center text-sm text-(--muted-text)">
            {authOption === AuthOption.Register ? 'Already have an account?' : "Don't have an account?"}
            <button
              type="button"
              onClick={() =>
                setAuthOption(authOption === AuthOption.Login ? AuthOption.Register : AuthOption.Login)
              }
              className={`ml-1! cursor-pointer rounded-[4px]! px-0.5! font-semibold text-(--text) underline underline-offset-3 ${focusRing}`}
            >
              {authOption === AuthOption.Register ? 'Log in' : 'Sign up'}
            </button>
          </p>
        </div>
      </dialog>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={notification.isOpen}
        onClose={() => setNotification({ isOpen: false, message: '', type: '' })}
        key={'loginError'}
      >
        <Alert
          onClose={() => setNotification({ isOpen: false, message: '', type: '' })}
          variant="filled"
          severity={notification.type as 'success' | 'error' | 'warning' | 'info'}
          className="w-full!"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  )
}
