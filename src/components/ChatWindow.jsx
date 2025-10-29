import { useEffect, useState, useRef } from 'react'
import { useAuth } from '../AuthContext'

function ChatWindow({ chatInfo, onBack }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 3000) // Poll every 3 seconds
    return () => clearInterval(interval)
  }, [chatInfo])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchMessages = () => {
    const params = new URLSearchParams({
      user1: user.username,
      user2: chatInfo.otherUser
    })
    if (chatInfo.itemId) {
      params.append('itemId', chatInfo.itemId)
    }

    fetch(`/api/messages?${params}`)
      .then(res => res.json())
      .then(data => {
        setMessages(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load messages:', err)
        setLoading(false)
      })
  }

  const sendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const messageData = {
      sender: user.username,
      receiver: chatInfo.otherUser,
      content: newMessage,
      itemId: chatInfo.itemId,
      itemTitle: chatInfo.itemTitle !== 'Direct Message' ? chatInfo.itemTitle : null
    }

    fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(messageData)
    })
      .then(res => res.json())
      .then(sent => {
        setMessages(prev => [...prev, sent])
        setNewMessage('')
        scrollToBottom()
      })
      .catch(err => {
        console.error('Failed to send message:', err)
        alert('Failed to send message. Please try again.')
      })
  }

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--card-bg) 0%, #1e2447 100%)',
        borderRadius: '20px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <button 
          className="btn outline" 
          onClick={onBack}
          style={{ padding: '0.5rem 1rem' }}
        >
          ← Back
        </button>
        
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'white' }}>
            Chat with {chatInfo.otherUser}
          </h2>
          {chatInfo.itemTitle !== 'Direct Message' && (
            <div style={{ color: 'var(--accent)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
              About: {chatInfo.itemTitle}
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div style={{
        background: 'linear-gradient(135deg, var(--card-bg) 0%, #1e2447 100%)',
        borderRadius: '20px',
        border: '1px solid var(--border)',
        height: '500px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Messages List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              color: 'var(--text-muted)', 
              padding: '3rem',
              fontSize: '1.1rem'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMe = msg.sender === user.username
              return (
                <div
                  key={idx}
                  style={{
                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '70%'
                  }}
                >
                  <div style={{
                    background: isMe 
                      ? 'linear-gradient(135deg, var(--accent), var(--accent-2))'
                      : 'rgba(255, 255, 255, 0.08)',
                    color: 'white',
                    padding: '0.85rem 1.2rem',
                    borderRadius: isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    wordWrap: 'break-word'
                  }}>
                    <div style={{ fontSize: '1rem', lineHeight: '1.5' }}>
                      {msg.content}
                    </div>
                  </div>
                  
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    marginTop: '0.3rem',
                    textAlign: isMe ? 'right' : 'left',
                    paddingLeft: isMe ? 0 : '0.5rem',
                    paddingRight: isMe ? '0.5rem' : 0
                  }}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form 
          onSubmit={sendMessage}
          style={{
            padding: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(0, 0, 0, 0.2)',
            display: 'flex',
            gap: '1rem'
          }}
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.06)',
              border: '2px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '12px',
              padding: '0.85rem 1.2rem',
              color: 'white',
              fontSize: '1rem'
            }}
          />
          <button 
            type="submit" 
            className="btn"
            style={{ padding: '0.85rem 2rem' }}
          >
            Send 📤
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatWindow
