import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const register = (data) => API.post('/auth/register', data)
export const login = (data) => API.post('/auth/login', data)
export const logout = () => API.post('/auth/logout')
export const getProfile = () => API.get('/auth/profile')
export const deleteAccount = () => API.delete('/auth/delete-account')
export const googleAuth = () => API.post('/auth/google')