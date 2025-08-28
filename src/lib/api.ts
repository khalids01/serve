import axios from 'axios'

// Axios instance configured to send cookies for same-origin requests
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || '',
  withCredentials: true,
})

export default api
