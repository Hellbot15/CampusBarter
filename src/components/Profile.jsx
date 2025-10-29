import React, { useState, useEffect } from 'react'
import { useAuth } from '../AuthContext'
import ItemCard from './ItemCard'

export default function Profile() {
  const { user, token } = useAuth()
  const [myItems, setMyItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchMyItems()
    }
  }, [user])

  const fetchMyItems = async () => {
    try {
      const res = await fetch('/api/items')
      if (res.ok) {
        const allItems = await res.json()
        // Filter items by current user's username
        const userItems = allItems.filter(item => item.ownerUsername === user.username)
        setMyItems(userItems)
      }
    } catch (err) {
      console.error('Error fetching items:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (itemId) => {
    setMyItems(prev => prev.filter(item => item.id !== itemId))
  }

  const claimAllItems = async () => {
    if (!confirm('This will update ALL items in the database to be owned by you. Continue?')) return
    
    try {
      const res = await fetch('/api/items')
      const allItems = await res.json()
      
      for (const item of allItems) {
        await fetch(`/api/items/${item.id}/claim`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ownerUsername: user.username })
        })
      }
      
      alert('All items claimed! Please refresh the page.')
      fetchMyItems()
    } catch (err) {
      console.error('Error claiming items:', err)
      alert('Failed to claim items')
    }
  }

  const deleteAllItems = async () => {
    if (!confirm('⚠️ WARNING: This will permanently delete ALL items from the database! Continue?')) return
    
    try {
      const res = await fetch('/api/items/all', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (res.ok) {
        alert('All items deleted successfully!')
        setMyItems([])
        window.location.reload() // Reload to fetch fresh data
      } else {
        alert('Failed to delete items: ' + res.status)
      }
    } catch (err) {
      console.error('Error deleting items:', err)
      alert('Failed to delete items: ' + err.message)
    }
  }

  if (!user) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Please login to view your profile</h2>
      </div>
    )
  }

  const stats = {
    total: myItems.length,
    byCategory: myItems.reduce((acc, item) => {
      const cat = item.category || 'General'
      acc[cat] = (acc[cat] || 0) + 1
      return acc
    }, {})
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      {/* Profile Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            fontWeight: 'bold'
          }}>
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem' }}>{user.username}</h1>
            <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>{user.email}</p>
          </div>
        </div>
        
        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '1rem',
          marginTop: '1.5rem'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.total}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Items</div>
          </div>
          {Object.entries(stats.byCategory).map(([category, count]) => (
            <div key={category} style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '1rem',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{count}</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>{category}</div>
            </div>
          ))}
        </div>
      </div>

      {/* My Items Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, color: '#e0e0e0' }}>
            📦 My Items ({myItems.length})
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={claimAllItems}
              className="btn outline"
              style={{ fontSize: '0.9rem' }}
            >
              🔧 Claim All
            </button>
            <button 
              onClick={deleteAllItems}
              className="btn"
              style={{ fontSize: '0.9rem', background: '#dc3545' }}
            >
              🗑️ Delete All
            </button>
          </div>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
            Loading your items...
          </div>
        ) : myItems.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            background: '#1e1e2e',
            borderRadius: '12px',
            border: '2px dashed #444'
          }}>
            <p style={{ fontSize: '1.2rem', color: '#888', margin: 0 }}>
              You haven't posted any items yet
            </p>
            <p style={{ color: '#666', marginTop: '0.5rem' }}>
              Click "Post Item" to share your first item!
            </p>
          </div>
        ) : (
          <div className="items-grid">
            {myItems.map(item => (
              <ItemCard 
                key={item.id} 
                item={item} 
                onDelete={handleDelete}
                showDeleteButton={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
