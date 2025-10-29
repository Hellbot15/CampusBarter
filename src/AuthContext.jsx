import React, { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext(null)
const API_URL = import.meta.env.VITE_API_URL || ''

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetch(`${API_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.ok ? res.json() : null)
        .then(data => { if (data) setUser(data) })
        .catch(() => {})
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (username, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    if (res.ok) {
      const data = await res.json()
      localStorage.setItem('token', data.token)
      setUser({ username: data.username, fullName: data.fullName })
      return { success: true }
    }
    const error = await res.json()
    return { success: false, error: error.error || 'Login failed' }
  }

  const register = async (username, password, email, fullName) => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email, fullName })
    })
    if (res.ok) {
      const data = await res.json()
      localStorage.setItem('token', data.token)
      setUser({ username: data.username, fullName: data.fullName })
      return { success: true }
    }
    const error = await res.json()
    return { success: false, error: error.error || 'Registration failed' }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const token = localStorage.getItem('token')

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
