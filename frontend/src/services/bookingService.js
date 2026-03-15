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

export const getAllSlots = () => API.get('/bookings/slots')
export const createBooking = (data) => API.post('/bookings', data)
export const getUserBookings = () => API.get('/bookings')
export const cancelBooking = (id) => API.delete(`/bookings/${id}`)
export const payForBooking = (id) => API.post(`/bookings/${id}/pay`)