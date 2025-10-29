import { useEffect, useState } from 'react'
import { useAuth } from '../AuthContext'
import ChatWindow from './ChatWindow'

function Messages() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConversations()
    
    // Check if we should open a specific chat
    const openChatData = sessionStorage.getItem('openChat')
    if (openChatData) {
      const chatInfo = JSON.parse(openChatData)
      setSelectedChat(chatInfo)
      sessionStorage.removeItem('openChat')
    }
  }, [user])

  const fetchConversations = () => {
    fetch(`/api/messages/conversations?username=${user.username}`)
      .then(res => res.json())
      .then(data => {
        setConversations(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load conversations:', err)
        setLoading(false)
      })
  }

  const startNewChat = () => {
    const recipient = prompt('Enter username to chat with:')
    if (recipient && recipient !== user.username) {
      setSelectedChat({
        otherUser: recipient,
        itemTitle: 'Direct Message',
        itemId: null
      })
    }
  }

  if (selectedChat) {
    return (
      <ChatWindow 
        chatInfo={selectedChat}
        onBack={() => {
          setSelectedChat(null)
          fetchConversations()
        }}
      />
    )
  }

  return (
    <div className="container">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>
          💬 Messages
        </h1>
        <button className="btn" onClick={startNewChat}>
          ✉️ New Chat
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading conversations...</div>
      ) : conversations.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          color: 'var(--text-muted)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💬</div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No messages yet</h3>
          <p>Start a conversation by clicking "New Chat" or contact item owners!</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gap: '1rem'
        }}>
          {conversations.map((conv, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedChat({
                otherUser: conv.otherUser,
                itemTitle: conv.itemTitle || 'Direct Message',
                itemId: conv.itemId
              })}
              className="card"
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                padding: '1.5rem',
                transition: 'all 0.3s'
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: 'white',
                flexShrink: 0
              }}>
                {conv.otherUser[0].toUpperCase()}
              </div>
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <h3 style={{ 
                    fontSize: '1.3rem', 
                    fontWeight: '600',
                    color: 'white',
                    margin: 0
                  }}>
                    {conv.otherUser}
                  </h3>
                  {conv.unreadCount > 0 && (
                    <span style={{
                      background: '#ef4444',
                      color: 'white',
                      borderRadius: '12px',
                      padding: '0.25rem 0.6rem',
                      fontSize: '0.85rem',
                      fontWeight: 'bold'
                    }}>
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                
                {conv.itemTitle && (
                  <div style={{ 
                    color: 'var(--accent)', 
                    fontSize: '0.9rem',
                    marginBottom: '0.5rem'
                  }}>
                    Re: {conv.itemTitle}
                  </div>
                )}
                
                <div style={{ 
                  color: 'var(--text-muted)',
                  fontSize: '0.95rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {conv.lastMessage || 'No messages yet'}
                </div>
              </div>

              <div style={{ 
                fontSize: '1.5rem',
                color: 'var(--accent)',
                flexShrink: 0
              }}>
                →
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Messages
