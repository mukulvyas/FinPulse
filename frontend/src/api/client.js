import axios from 'axios'

const API_BASE = '/api/v1'

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('finpulse_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle auth errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('finpulse_token')
      localStorage.removeItem('finpulse_officer')
    }
    return Promise.reject(error)
  }
)

export default client

// Auth
export const authAPI = {
  login: (email, password) => client.post('/auth/login', { email, password }),
  register: (data) => client.post('/auth/register', data),
}

// MSME
export const msmeAPI = {
  assess: (data) => client.post('/msme/assess', data),
  getResult: (applicationId) => client.get(`/msme/${applicationId}/result`),
}

// Officer
export const officerAPI = {
  getQueue: () => client.get('/officer/queue'),
  getApplication: (id) => client.get(`/officer/application/${id}`),
  submitDecision: (data) => client.post('/officer/decision', data),
}

// Analytics
export const analyticsAPI = {
  getPortfolio: () => client.get('/analytics/portfolio'),
}

// OCEN
export const ocenAPI = {
  getPayload: (applicationId) => client.get(`/ocen/payload/${applicationId}`),
}

// Utility: Format INR amounts
export function formatINR(amount) {
  if (!amount && amount !== 0) return '—'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}
