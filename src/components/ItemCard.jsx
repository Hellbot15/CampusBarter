import React, { useState } from 'react'
import { useAuth } from '../AuthContext'

export default function ItemCard({ item, onDelete, showDeleteButton, onStartChat }) {
  const { user, token } = useAuth()
  const [showContact, setShowContact] = useState(false)
  // Check if current user owns this item
  const isOwner = showDeleteButton !== undefined ? showDeleteButton : (user && user.username === item.ownerUsername)

  const handleStartChat = () => {
    if (onStartChat) {
      onStartChat({
        otherUser: item.ownerUsername || item.owner,
        itemTitle: item.title,
        itemId: item.id
      })
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this item?')) return
    
    try {
      console.log('Deleting item:', item.id)
      console.log('Using token:', token ? 'Token exists' : 'No token')
      
      const res = await fetch(`/api/items/${item.id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      console.log('Delete response status:', res.status)
      
      if (res.ok) {
        alert('Item deleted successfully!')
        onDelete(item.id)
      } else if (res.status === 403) {
        alert('You can only delete your own items')
      } else if (res.status === 401) {
        alert('Please login to delete items')
      } else {
        const errorText = await res.text()
        console.error('Delete failed:', errorText)
        alert(`Failed to delete item: ${res.status}`)
      }
    } catch (err) {
      console.error('Delete error:', err)
      alert('Error deleting item: ' + err.message)
    }
  }

  return (
    <article className="card">
      <div className="card-body">
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="tag" style={{ background: '#4a5568' }}>{item.category || 'General'}</span>
          <span className="tag" style={{ background: '#2d3748' }}>{item.type || 'offer'}</span>
        </div>
        <h3 className="card-title">{item.title}</h3>
        <p className="card-owner">Offered by <strong>{item.owner}</strong></p>
        <p className="card-desc">{item.description}</p>
        <div className="card-tags">
          {(item.tags || []).map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
        
        {showContact && item.contactEmail && (
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#2a2a3a', borderRadius: '6px' }}>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#a0a0b0' }}>Contact Info:</p>
            <p style={{ margin: '0.25rem 0', fontSize: '0.95rem' }}>📧 {item.contactEmail}</p>
            {item.contactPhone && <p style={{ margin: '0.25rem 0', fontSize: '0.95rem' }}>📱 {item.contactPhone}</p>}
          </div>
        )}
      </div>
      <div className="card-actions">
        {!isOwner && (
          <>
            <button className="btn" onClick={handleStartChat}>
              💬 Chat
            </button>
            <button className="btn outline" onClick={() => setShowContact(!showContact)}>
              {showContact ? 'Hide Contact' : 'Contact Info'}
            </button>
          </>
        )}
        {isOwner && (
          <button className="btn" style={{ background: '#dc3545' }} onClick={handleDelete}>
            Delete Item
          </button>
        )}
      </div>
    </article>
  )
}
