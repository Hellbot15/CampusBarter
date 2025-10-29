// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || ''

// Helper function for API calls
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`
  const defaultHeaders = {
    'Content-Type': 'application/json',
  }

  const token = localStorage.getItem('token')
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  return fetch(url, config)
}

export default API_URL
