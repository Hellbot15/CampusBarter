import React, { useState } from 'react'
import { useAuth } from '../AuthContext'

export default function PostItemForm({ onClose, onCreate }) {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [owner, setOwner] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [category, setCategory] = useState('Academic')
  const [type, setType] = useState('offer')

  const categories = ['Academic', 'Skills', 'Hardware', 'Marketplace', 'Community', 'Services', 'Food', 'Events']
  const types = {
    'Academic': ['offer', 'request'],
    'Skills': ['offer', 'request'],
    'Hardware': ['offer', 'request'],
    'Marketplace': ['offer', 'request'],
    'Community': ['lost', 'found', 'ride-offer', 'ride-request', 'announcement'],
    'Services': ['offer', 'request'],
    'Food': ['offer', 'request'],
    'Events': ['event', 'workshop', 'meetup']
  }

  const submit = async (e) => {
    e.preventDefault()
    const payload = { 
      title, 
      owner, 
      ownerUsername: user.username,
      contactEmail,
      contactPhone,
      description, 
      tags: tags.split(',').map(t=>t.trim()).filter(Boolean),
      category,
      type
    }
    try {
      const res = await fetch('/api/items', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) })
      if (res.ok) {
        const created = await res.json()
        onCreate(created)
        onClose()
      } else {
        alert('Failed to create item')
      }
    } catch (err) {
      console.error(err)
      alert('Error creating item')
    }
  }

  return (
    <div className="modal">
      <form className="modal-content" onSubmit={submit}>
        <h3>Post new item</h3>
        
        <label>Category
          <select value={category} onChange={e => { setCategory(e.target.value); setType(types[e.target.value][0]); }} required>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </label>

        <label>Type
          <select value={type} onChange={e => setType(e.target.value)} required>
            {types[category].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}</option>)}
          </select>
        </label>

        <label>Title
          <input value={title} onChange={e=>setTitle(e.target.value)} required />
        </label>
        <label>Your Name
          <input value={owner} onChange={e=>setOwner(e.target.value)} required />
        </label>
        <label>Contact Email
          <input type="email" value={contactEmail} onChange={e=>setContactEmail(e.target.value)} required />
        </label>
        <label>Contact Phone (optional)
          <input type="tel" value={contactPhone} onChange={e=>setContactPhone(e.target.value)} />
        </label>
        <label>Description
          <textarea value={description} onChange={e=>setDescription(e.target.value)} />
        </label>
        <label>Tags (comma separated)
          <input value={tags} onChange={e=>setTags(e.target.value)} />
        </label>

        <div className="modal-actions">
          <button type="button" className="btn outline" onClick={onClose}>Cancel</button>
          <button className="btn" type="submit">Post</button>
        </div>
      </form>
    </div>
  )
}
