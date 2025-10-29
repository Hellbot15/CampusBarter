import React from 'react'
import { useAuth } from '../AuthContext'

export default function Header({ title, subtitle, onPostClick }) {
  const { user, logout } = useAuth()

  return (
    <header className="site-header">
      <div className="site-header-inner container">
        <div>
          <h1 className="site-title">{title}</h1>
          <p className="site-subtitle">{subtitle}</p>
        </div>

        <div className="header-actions">
          {user && <span className="user-welcome">Welcome, {user.fullName || user.username}!</span>}
          <button className="btn" onClick={onPostClick}>Post item</button>
          {user && <button className="btn outline" onClick={logout}>Logout</button>}
        </div>
      </div>
    </header>
  )
}
