import { useEffect, useState } from 'react'
import './App.css'
import Header from './components/Header'
import ItemCard from './components/ItemCard'
import PostItemForm from './components/PostItemForm'
import LoginForm from './components/LoginForm'
import Profile from './components/Profile'
import Messages from './components/Messages'
import { useAuth } from './AuthContext'

const API_URL = import.meta.env.VITE_API_URL || ''

function App() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showPost, setShowPost] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [currentView, setCurrentView] = useState('home') // 'home' or 'profile' or 'messages'
  const { user, loading: authLoading } = useAuth()

  const handleStartChat = (chatInfo) => {
    setCurrentView('messages')
    // Store chat info to open specific conversation
    sessionStorage.setItem('openChat', JSON.stringify(chatInfo))
  }

  const categories = ['All', 'Academic', 'Skills', 'Hardware', 'Marketplace', 'Community', 'Services', 'Food', 'Events']

  useEffect(() => {
    // Try to fetch from backend, fallback to mock data when unavailable
    fetch(`${API_URL}/api/items`)
      .then((res) => {
        if (!res.ok) throw new Error('network')
        return res.json()
      })
      .then((data) => setItems(data))
      .catch(() => {
        // fallback mock
        setItems([
          { id: 1, title: 'Calculus Textbook', owner: 'Ayesha', description: 'Good condition, some notes', tags: ['books', 'education'] },
          { id: 2, title: 'Guitar Lessons', owner: 'Bilal', description: '30-minute session, beginner-friendly', tags: ['skills', 'music'] },
        ])
      })
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = (created) => {
    setItems((s) => [created, ...s])
  }

  const handleDelete = (deletedId) => {
    setItems((s) => s.filter(item => item.id !== deletedId))
  }

  if (authLoading) {
    return <div className="app-root dark"><div className="loading">Loading...</div></div>
  }

  if (!user) {
    return (
      <div className="app-root dark">
        <LoginForm />
      </div>
    )
  }

  return (
    <div className="app-root dark">
      <Header title="CampusBarter — The Rizvi Exchange" subtitle="An exclusive, cashless student marketplace" onPostClick={() => setShowPost(true)} />

      {/* Navigation Tabs */}
      <div style={{
        background: '#1e1e2e',
        padding: '1rem',
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        borderBottom: '2px solid #2a2a3a'
      }}>
        <button 
          className={currentView === 'home' ? 'btn' : 'btn outline'}
          onClick={() => setCurrentView('home')}
          style={{ minWidth: '120px' }}
        >
          🏠 Home
        </button>
        <button 
          className={currentView === 'messages' ? 'btn' : 'btn outline'}
          onClick={() => setCurrentView('messages')}
          style={{ minWidth: '120px' }}
        >
          💬 Messages
        </button>
        <button 
          className={currentView === 'profile' ? 'btn' : 'btn outline'}
          onClick={() => setCurrentView('profile')}
          style={{ minWidth: '120px' }}
        >
          👤 My Profile
        </button>
      </div>

      {currentView === 'profile' ? (
        <Profile />
      ) : currentView === 'messages' ? (
        <Messages />
      ) : (
        <main className="container">
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button 
              key={cat}
              className={selectedCategory === cat ? 'btn' : 'btn outline'}
              onClick={() => setSelectedCategory(cat)}
              style={{ padding: '0.5rem 1rem' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading">Loading items…</div>
        ) : selectedCategory === 'All' ? (
          // Show all categories as separate sections
          categories.slice(1).map(category => {
            const categoryItems = items.filter(item => item.category === category)
            if (categoryItems.length === 0) return null
            
            return (
              <div key={category} style={{ marginBottom: '3rem' }}>
                <h2 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  marginBottom: '1rem',
                  color: '#60a5fa',
                  borderBottom: '2px solid #374151',
                  paddingBottom: '0.5rem'
                }}>
                  {category === 'Academic' && '📚'} 
                  {category === 'Skills' && '🎓'} 
                  {category === 'Hardware' && '⚙️'} 
                  {category === 'Marketplace' && '🛒'} 
                  {category === 'Community' && '👥'} 
                  {category === 'Services' && '💼'} 
                  {category === 'Food' && '🍽️'} 
                  {category === 'Events' && '📅'} 
                  {' '}{category}
                </h2>
                <section className="items">
                  {categoryItems.map((it) => <ItemCard key={it.id} item={it} onDelete={handleDelete} onStartChat={handleStartChat} />)}
                </section>
              </div>
            )
          })
        ) : (
          // Show only selected category
          <section className="items">
            {items
              .filter(item => item.category === selectedCategory || (!item.category && selectedCategory === 'All'))
              .map((it) => <ItemCard key={it.id} item={it} onDelete={handleDelete} onStartChat={handleStartChat} />)
            }
          </section>
        )}
      </main>
      )
      }

      <footer className="app-footer">&copy; {new Date().getFullYear()} Rizvi Exchange — Built for students</footer>

      {showPost && (
        <PostItemForm onClose={() => setShowPost(false)} onCreate={handleCreate} />
      )}
    </div>
  )
}

export default App
