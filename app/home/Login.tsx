'use client'

import {
  Button,
  Box,
  Typography,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import GoogleIcon from '@mui/icons-material/Google'
import FacebookIcon from '@mui/icons-material/Facebook'
import { login, register } from '../services/authService'
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
    <div className="flex justify-end ">
      <Button variant="contained" onClick={handleAuth} className="bg-indigo-600 mb-">
        {userIsLogged ? 'Log Out' : 'Sign Up Now'}
      </Button>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="xs">
        {/* Close Button */}
        <IconButton
          onClick={() => setModalOpen(false)}
          sx={{ position: 'absolute', right: 16, top: 16, color: 'grey.500' }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent className="flex flex-col items-center">
          <Typography variant="h4" className="font-bold text-gray-800 mb-3">
            {authOption === AuthOption.Register ? 'Create Account' : 'Login'}
          </Typography>
          <Box className="w-full flex flex-col gap-4">
            {authOption === AuthOption.Register && (
              <div className="flex flex-col gap-1">
                <Typography variant="caption" className="font-bold text-gray-700 ml-1">
                  Full Name
                </Typography>
                <TextField
                  fullWidth
                  value={authForm.fullname}
                  onChange={(e) => updateAuthForm((prev) => ({ ...prev, fullname: e.target.value }))}
                  placeholder="Enter your name"
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f3f4f6' } }}
                />
              </div>
            )}

            <div className="flex flex-col gap-1">
              <Typography variant="caption" className="font-bold text-gray-700 ml-1">
                Email
              </Typography>
              <TextField
                fullWidth
                value={authForm.email}
                onChange={(e) => updateAuthForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f3f4f6' } }}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Typography variant="caption" className="font-bold text-gray-700 ml-1">
                Password
              </Typography>
              <TextField
                fullWidth
                type="password"
                value={authForm.password}
                onChange={(e) => updateAuthForm((prev) => ({ ...prev, password: e.target.value }))}
                placeholder={authOption === AuthOption.Register ? 'Create a password' : 'Enter your password'}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f3f4f6' } }}
              />
            </div>
            <form onSubmit={handleUserAuth}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                className="mt-4 py-3 normal-case text-lg font-bold"
                style={{ backgroundColor: '#818cf8', borderRadius: 16 }}
              >
                {authOption === AuthOption.Register ? 'Create Account' : 'Login'}
              </Button>
            </form>
          </Box>

          <div className="w-full mt-6">
            <Divider className="text-gray-400 text-xs pb-6 uppercase">Or sign up with</Divider>

            <div className="flex gap-4">
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={() => {
                  googleAuth()
                }}
                className="py-2 border-gray-300 text-gray-700 normal-case rounded-xl"
              >
                Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FacebookIcon />}
                onClick={() => {
                  /* Your fbAuth logic */
                }}
                className="py-2 border-gray-300 text-gray-700 normal-case rounded-xl"
              >
                Facebook
              </Button>
            </div>
          </div>

          <Typography variant="body2" className="pt-3 text-gray-500">
            {authOption === AuthOption.Register ? 'Already have an account?' : 'Dont have an account?'}
            <span
              className="text-indigo-500 cursor-pointer font-bold ml-1"
              onClick={() =>
                setAuthOption(authOption === AuthOption.Login ? AuthOption.Register : AuthOption.Login)
              }
            >
              {authOption === AuthOption.Register ? 'Login' : 'Register'}
            </span>
          </Typography>
        </DialogContent>
      </Dialog>
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
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  )
}
