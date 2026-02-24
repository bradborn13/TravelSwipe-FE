// lib/api.ts
import axios from 'axios'
import api from './api'

export async function register(params: { fullname: string; email: string; password: string }) {
  try {
    const response = (await api.post('/auth/register', params)) as { access_token: string }
    console.log(response, 'register')
    localStorage.setItem('token', response.data.access_token)
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.message || 'Login failed', { cause: err })
    }
    throw err
  }
}
export async function login(params: { email: string; password: string }) {
  try {
    const response = (await api.post('/auth/login', params)) as { access_token: string }
    console.log(response, 'login')
    localStorage.setItem('token', response.data?.access_token)
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.message || 'Login failed', { cause: err })
    }
    throw err
  }
}
