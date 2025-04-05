import React, { useState } from 'react'
import { apiService } from '../../../api/api.js'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CSpinner,
  CAlert,
  CForm,
  CFormTextarea,
} from '@coreui/react'

const ChatbotCard = () => {
  const [messages, setMessages] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleQueryChange = (event) => {
    setQuery(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!query.trim()) return

    // Add the user's message to the chat
    setMessages((prevMessages) => [...prevMessages, { text: query, type: 'user' }])
    setLoading(true)
    setError(null)

    try {
      const response = await apiService.post('/chatbot', { query })

      // Add the bot's response to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: response.data.result || 'No response received.', type: 'bot' },
      ])
    } catch (err) {
      console.error('Failed to get response:', err)
      setError(err.response?.data?.message || 'Failed to get response.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CCard className="shadow-sm">
      <CCardHeader className="bg-primary text-white fw-bold">Chatbot</CCardHeader>
      <CCardBody>
        <div className="mb-3">
          <h5>Ask me anything:</h5>
          <div
            className="chat-container"
            style={{
              maxHeight: '300px',
              overflowY: 'auto',
              marginBottom: '15px',
              padding: '10px',
              backgroundColor: '#f7f7f7',
              borderRadius: '10px',
              border: '1px solid #ccc',
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${message.type}`}
                style={{
                  display: 'flex',
                  justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '10px',
                }}
              >
                <div
                  style={{
                    maxWidth: '60%',
                    padding: '10px',
                    borderRadius: '15px',
                    backgroundColor: message.type === 'user' ? '#007bff' : '#f1f1f1',
                    color: message.type === 'user' ? '#fff' : '#333',
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <CForm onSubmit={handleSubmit}>
            <CFormTextarea
              value={query}
              onChange={handleQueryChange}
              rows={3}
              placeholder="Type your query here"
            />
            <div className="d-flex justify-content-end mt-2">
              <CButton type="submit" color="primary" disabled={loading}>
                {loading ? <CSpinner size="sm" color="light" /> : 'Submit'}
              </CButton>
            </div>
          </CForm>
        </div>

        {error && (
          <CAlert color="danger" className="text-center">
            {error}
          </CAlert>
        )}
      </CCardBody>
    </CCard>
  )
}

export default ChatbotCard
