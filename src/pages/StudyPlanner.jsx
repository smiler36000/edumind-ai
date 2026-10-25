import { useMemo, useState } from 'react'
import { EmptyState, Notice, PageHeader } from '../components/Ui'
import {
  formatDate,
  formatTimeRange,
  makeId,
  relativeDayLabel,
  todayISO,
} from '../utils/dates'
import './ListPages.css'

const EMPTY_FORM = {
  subject: '',
  topic: '',
  date: todayISO(),
  startTime: '18:00',
  duration: '60',
}

export default function StudyPlanner({ sessions, setSessions }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [feedback, setFeedback] = useState('')
  const [filter, setFilter] = useState('all')

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.subject.trim()) next.subject = 'Course code or subject is required.'
    if (!form.topic.trim()) next.topic = 'Topic is required.'
    if (!form.date) next.date = 'Please select a date.'
    if (!form.startTime) next.startTime = 'Please choose a start time.'
    const duration = Number(form.duration)
    if (!form.duration || Number.isNaN(duration)) {
      next.duration = 'Duration is required and must be a number.'
    } else if (duration < 10 || duration > 480) {
      next.duration = 'Duration must be between 10 and 480 minutes.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setFeedback('')
    if (!validate()) return

    const session = {
      id: makeId(),
      subject: form.subject.trim(),
      topic: form.topic.trim(),
      date: form.date,
      startTime: form.startTime,
      duration: Number(form.duration),
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    }
    setSessions((prev) => [...prev, session])
    setForm({ ...EMPTY_FORM, date: form.date, startTime: form.startTime })
    setFeedback(`Session added: ${session.subject} on ${formatDate(session.date)}.`)
  }

  const toggleComplete = (id) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              completed: !s.completed,
              completedAt: !s.completed ? new Date().toISOString() : null,
            }
          : s
      )
    )
  }

  const removeSession = (id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id))
    setFeedback('Session deleted.')
  }

  const sorted = useMemo(() => {
    return [...sessions].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1
      if (a.date !== b.date) return a.date < b.date ? -1 : 1
      return (a.startTime || '').localeCompare(b.startTime || '')
    })
  }, [sessions])

  const visible = useMemo(() => {
    const today = todayISO()
    if (filter === 'upcoming') {
      return sorted.filter((s) => !s.completed && s.date >= today)
    }
    if (filter === 'completed') return sorted.filter((s) => s.completed)
    if (filter === 'today') return sorted.filter((s) => s.date === today)
    return sorted
  }, [sorted, filter])

  const classify = (s) => {
    if (s.completed) return { label: 'Completed', cls: 'badge-green' }
    if (s.date < todayISO()) return { label: 'Missed', cls: 'badge-red' }
    if (s.date === todayISO()) return { label: 'Today', cls: 'badge-violet' }
    return { label: relativeDayLabel(s.date) || 'Upcoming', cls: 'badge-blue' }
  }

  return (
    <>
      <PageHeader
        title="Study Planner"
        subtitle="Schedule focused study blocks, mark them complete and keep a clear record of what you have actually studied."
      />

      {feedback ? <Notice tone="success">{feedback}</Notice> : null}

      <div className="grid-2">
        <section className="panel">
          <h2 className="panel-title">Add a study session</h2>
          <p className="panel-subtitle">All fields are required.</p>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <div className={`field${errors.subject ? ' field-error' : ''}`}>
                <label htmlFor="subject">
                  Subject / course code <span className="required">*</span>
                </label>
                <input
                  id="subject"
                  type="text"
                  placeholder="e.g. CSM 395"
                  value={form.subject}
                  onChange={(e) => update('subject', e.target.value)}
                />
                {errors.subject ? <p className="error-text">{errors.subject}</p> : null}
              </div>

              <div className={`field${errors.topic ? ' field-error' : ''}`}>
                <label htmlFor="topic">
                  Topic <span className="required">*</span>
                </label>
                <input
                  id="topic"
                  type="text"
                  placeholder="e.g. Search algorithms"
                  value={form.topic}
                  onChange={(e) => update('topic', e.target.value)}
                />
                {errors.topic ? <p className="error-text">{errors.topic}</p> : null}
              </div>

              <div className={`field${errors.date ? ' field-error' : ''}`}>
                <label htmlFor="session-date">
                  Date <span className="required">*</span>
                </label>
                <input
                  id="session-date"
                  type="date"
                  value={form.date}
                  onChange={(e) => update('date', e.target.value)}
                />
                {errors.date ? <p className="error-text">{errors.date}</p> : null}
              </div>

              <div className={`field${errors.startTime ? ' field-error' : ''}`}>
                <label htmlFor="start-time">
                  Start time <span className="required">*</span>
                </label>
                <input
                  id="start-time"
                  type="time"
                  value={form.startTime}
                  onChange={(e) => update('startTime', e.target.value)}
                />
                {errors.startTime ? <p className="error-text">{errors.startTime}</p> : null}
              </div>

              <div className={`field${errors.duration ? ' field-error' : ''}`}>
                <label htmlFor="duration">
                  Duration (minutes) <span className="required">*</span>
                </label>
                <input
                  id="duration"
                  type="number"
                  min="10"
                  max="480"
                  step="5"
                  placeholder="60"
                  value={form.duration}
                  onChange={(e) => update('duration', e.target.value)}
                />
                {errors.duration ? <p className="error-text">{errors.duration}</p> : null}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Add session
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setForm(EMPTY_FORM)
                  setErrors({})
                  setFeedback('')
                }}
              >
                Clear form
              </button>
            </div>
          </form>
        </section>

        <section className="panel">
          <h2 className="panel-title">Planner overview</h2>
          <p className="panel-subtitle">Calculated from your saved sessions.</p>
          <div className="overview-grid">
            <div className="overview-item">
              <strong>{sessions.length}</strong>
              <span>Total sessions</span>
            </div>
            <div className="overview-item">
              <strong>{sessions.filter((s) => s.date === todayISO()).length}</strong>
              <span>Planned today</span>
            </div>
            <div className="overview-item">
              <strong>{sessions.filter((s) => s.completed).length}</strong>
              <span>Completed</span>
            </div>
            <div className="overview-item">
              <strong>
                {sessions.filter((s) => !s.completed && s.date < todayISO()).length}
              </strong>
              <span>Missed</span>
            </div>
          </div>
          <Notice tone="info">
            Sessions are saved in your browser's localStorage, so they remain after you refresh
            or close the page.
          </Notice>
        </section>
      </div>

      <section className="panel">
        <div className="section-title">
          <h2>Scheduled sessions</h2>
          <div className="tabs" role="tablist" aria-label="Filter sessions">
            {[
              ['all', 'All'],
              ['today', 'Today'],
              ['upcoming', 'Upcoming'],
              ['completed', 'Completed'],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={filter === key}
                className={`tab${filter === key ? ' tab-active' : ''}`}
                onClick={() => setFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <EmptyState
            title={sessions.length === 0 ? 'No study sessions yet' : 'Nothing in this view'}
            message={
              sessions.length === 0
                ? 'Use the form above to schedule your first study block. It will be saved automatically in this browser.'
                : 'Switch to another filter or add a new session.'
            }
          />
        ) : (
          <div className="list">
            {visible.map((s) => {
              const status = classify(s)
              return (
                <article
                  key={s.id}
                  className={`row-card${s.completed ? ' is-done' : ''}${
                    !s.completed && s.date < todayISO() ? ' is-overdue' : ''
                  }`}
                >
                  <div className="row-main">
                    <h3 className={`row-title${s.completed ? ' done' : ''}`}>
                      {s.subject}: {s.topic}
                    </h3>
                    <div className="row-meta">
                      <span className="chip">▤ {formatDate(s.date)}</span>
                      <span className="chip">◷ {formatTimeRange(s.startTime, s.duration)}</span>
                      <span className="chip">{s.duration} min</span>
                      <span className={`badge ${status.cls}`}>{status.label}</span>
                    </div>
                  </div>
                  <div className="row-actions">
                    <button
                      type="button"
                      className={`btn btn-small ${s.completed ? 'btn-ghost' : 'btn-secondary'}`}
                      onClick={() => toggleComplete(s.id)}
                    >
                      {s.completed ? 'Mark pending' : 'Mark completed'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-small"
                      onClick={() => removeSession(s.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}
