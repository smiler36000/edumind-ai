import { useEffect, useRef, useState } from 'react'
import { EmptyState, Notice, PageHeader } from '../components/Ui'
import { ASSISTANT_DISCLOSURE, EXAMPLE_QUESTIONS, askAssistant } from '../lib/assistant'
import { makeId } from '../utils/dates'
import './Assistant.css'

const WELCOME = {
  id: 'welcome',
  role: 'assistant',
  text:
    'Hello! I am your rule-based study assistant. Ask me about study timetables, examination ' +
    'preparation, revision, assignment priorities, time management, procrastination, CSM 395 or ' +
    'your agent project. I also read your saved assignments and study sessions when it helps.',
}

export default function Assistant({ assignments, sessions }) {
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    const node = scrollRef.current
    if (node) node.scrollTop = node.scrollHeight
  }, [messages])

  const send = (text) => {
    const value = typeof text === 'string' ? text : input
    const trimmed = value.trim()

    if (!trimmed) {
      setError('Please type a message before sending.')
      return
    }

    setError('')
    const question = { id: makeId(), role: 'user', text: trimmed }
    const answer = {
      id: makeId(),
      role: 'assistant',
      text: askAssistant(trimmed, { assignments, sessions }),
    }
    setMessages((prev) => [...prev, question, answer])
    if (typeof text !== 'string') setInput('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    send()
  }

  const clearChat = () => {
    setMessages([WELCOME])
    setError('')
    setInput('')
  }

  return (
    <>
      <PageHeader
        title="AI Study Assistant"
        subtitle="Ask practical study questions and get answers based on hand-written rules plus your own saved assignments and sessions."
        actions={
          <button type="button" className="btn btn-ghost" onClick={clearChat}>
            Clear chat
          </button>
        }
      />

      <Notice tone="warning">
        <strong>Disclosure:</strong> {ASSISTANT_DISCLOSURE}
      </Notice>

      <section className="panel chat-panel" aria-label="Conversation">
        <div className="chat-messages" ref={scrollRef} role="log" aria-live="polite">
          {messages.map((m) => (
            <div key={m.id} className={`bubble-row bubble-${m.role}`}>
              <div className="bubble">
                <span className="bubble-role">{m.role === 'user' ? 'You' : 'Assistant'}</span>
                <p className="bubble-text">{m.text}</p>
              </div>
            </div>
          ))}
        </div>

        <form className="chat-form" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="chat-input">
            Type your question
          </label>
          <input
            id="chat-input"
            type="text"
            className="chat-input"
            placeholder="Ask about your timetable, revision, assignments..."
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              if (error) setError('')
            }}
            aria-describedby={error ? 'chat-error' : undefined}
          />
          <button type="submit" className="btn btn-primary">
            Send
          </button>
        </form>
        {error ? (
          <p id="chat-error" className="error-text chat-error">
            {error}
          </p>
        ) : null}
      </section>

      <section className="panel" aria-label="Example questions">
        <h2 className="panel-title">Try an example question</h2>
        <p className="panel-subtitle">Click any question to ask it immediately.</p>
        <div className="example-chips">
          {EXAMPLE_QUESTIONS.map((q) => (
            <button key={q} type="button" className="chip-btn" onClick={() => send(q)}>
              {q}
            </button>
          ))}
        </div>
      </section>

      {messages.length <= 1 ? (
        <EmptyState
          title="Conversation history is kept for this session"
          message="Messages appear above and stay while the page is open. Your assignment and study data are never sent anywhere - everything runs locally in the browser."
        />
      ) : null}
    </>
  )
}
