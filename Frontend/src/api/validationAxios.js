import axios from 'axios'

const validationAxios = axios.create({
  baseURL: import.meta.env.VITE_VALIDATION_API_URL || 'http://localhost:3002',
  timeout: 60000,
})

validationAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default validationAxios
