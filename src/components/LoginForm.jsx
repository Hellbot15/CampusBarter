import React, { useState } from 'react'
import { useAuth } from '../AuthContext'

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const { login, register } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (isLogin) {
      const result = await login(username, password)
      if (!result.success) setError(result.error)
    } else {
      const result = await register(username, password, email, fullName)
      if (!result.success) setError(result.error)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Login' : 'Register'} to CampusBarter</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Username
            <input value={username} onChange={e => setUsername(e.target.value)} required />
          </label>
          
          {!isLogin && (
            <>
              <label>
                Full Name
                <input value={fullName} onChange={e => setFullName(e.target.value)} required />
              </label>
              <label>
                Email
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </label>
            </>
          )}
          
          <label>
            Password
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </label>

          {error && <div className="error-message">{error}</div>}

          <button className="btn auth-btn" type="submit">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="auth-toggle">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button className="link-btn" onClick={() => { setIsLogin(!isLogin); setError('') }}>
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  )
}
