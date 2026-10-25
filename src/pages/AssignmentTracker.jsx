import { useMemo, useState } from 'react'
import { EmptyState, Notice, PageHeader } from '../components/Ui'
import { daysUntil, formatDate, makeId, todayISO } from '../utils/dates'
import { rankAssignments } from '../utils/stats'
import './ListPages.css'

const EMPTY_FORM = {
  title: '',
  courseCode: '',
  deadline: '',
  priority: 'medium',
}

function dueLabel(deadline) {
  const d = daysUntil(deadline)
  if (d === null) return { text: 'No deadline', cls: 'badge-slate' }
  if (d < 0) return { text: `Overdue by ${Math.abs(d)} day(s)`, cls: 'badge-red' }
  if (d === 0) return { text: 'Due today', cls: 'badge-red' }
  if (d === 1) return { text: 'Due tomorrow', cls: 'badge-amber' }
  if (d <= 3) return { text: `Due in ${d} days`, cls: 'badge-amber' }
  return { text: `Due in ${d} days`, cls: 'badge-blue' }
}

export default function AssignmentTracker({ assignments, setAssignments }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [feedback, setFeedback] = useState('')
  const [filter, setFilter] = useState('pending')

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.title.trim()) next.title = 'Assignment title is required.'
    if (!form.courseCode.trim()) next.courseCode = 'Course code is required.'
    if (!form.deadline) {
      next.deadline = 'Please select a deadline.'
    } else if (form.deadline < todayISO()) {
      next.deadline = 'The deadline cannot be earlier than today.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setFeedback('')
    if (!validate()) return

    const assignment = {
      id: makeId(),
      title: form.title.trim(),
      courseCode: form.courseCode.trim().toUpperCase(),
      deadline: form.deadline,
      priority: form.priority,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    }
    setAssignments((prev) => [...prev, assignment])
    setForm(EMPTY_FORM)
    setFeedback(`Assignment added: ${assignment.title} (due ${formatDate(assignment.deadline)}).`)
  }

  const toggleComplete = (id) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              completed: !a.completed,
              completedAt: !a.completed ? new Date().toISOString() : null,
            }
          : a
      )
    )
  }

  const removeAssignment = (id) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id))
    setFeedback('Assignment deleted.')
  }

  const pendingList = useMemo(() => rankAssignments(assignments), [assignments])
  const completedList = useMemo(
    () =>
      assignments
        .filter((a) => a.completed)
        .sort((a, b) => (a.deadline < b.deadline ? 1 : -1)),
    [assignments]
  )
  const overdueList = useMemo(
    () =>
      pendingList.filter((a) => daysUntil(a.deadline) !== null && daysUntil(a.deadline) < 0),
    [pendingList]
  )

  const visible =
    filter === 'completed' ? completedList : filter === 'overdue' ? overdueList : pendingList

  return (
    <>
      <PageHeader
        title="Assignment Tracker"
        subtitle="Record every assignment with its deadline and priority, then work through them in order of urgency."
      />

      {feedback ? <Notice tone="success">{feedback}</Notice> : null}

      <div className="grid-2">
        <section className="panel">
          <h2 className="panel-title">Add an assignment</h2>
          <p className="panel-subtitle">All fields are required.</p>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <div className={`field${errors.title ? ' field-error' : ''}`}>
                <label htmlFor="assignment-title">
                  Title <span className="required">*</span>
                </label>
                <input
                  id="assignment-title"
                  type="text"
                  placeholder="e.g. Data structures report"
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                />
                {errors.title ? <p className="error-text">{errors.title}</p> : null}
              </div>

              <div className={`field${errors.courseCode ? ' field-error' : ''}`}>
                <label htmlFor="course-code">
                  Course code <span className="required">*</span>
                </label>
                <input
                  id="course-code"
                  type="text"
                  placeholder="e.g. CSM 395"
                  value={form.courseCode}
                  onChange={(e) => update('courseCode', e.target.value)}
                />
                {errors.courseCode ? <p className="error-text">{errors.courseCode}</p> : null}
              </div>

              <div className={`field${errors.deadline ? ' field-error' : ''}`}>
                <label htmlFor="deadline">
                  Deadline <span className="required">*</span>
                </label>
                <input
                  id="deadline"
                  type="date"
                  value={form.deadline}
                  onChange={(e) => update('deadline', e.target.value)}
                />
                {errors.deadline ? <p className="error-text">{errors.deadline}</p> : null}
              </div>

              <div className="field">
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  value={form.priority}
                  onChange={(e) => update('priority', e.target.value)}
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Add assignment
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
          <h2 className="panel-title">Workload overview</h2>
          <p className="panel-subtitle">Live counts from your saved assignments.</p>
          <div className="overview-grid">
            <div className="overview-item">
              <strong>{assignments.length}</strong>
              <span>Total</span>
            </div>
            <div className="overview-item">
              <strong>{pendingList.length}</strong>
              <span>Pending</span>
            </div>
            <div className="overview-item">
              <strong>{completedList.length}</strong>
              <span>Completed</span>
            </div>
            <div className="overview-item">
              <strong>{overdueList.length}</strong>
              <span>Overdue</span>
            </div>
          </div>
          <Notice tone={overdueList.length ? 'warning' : 'info'}>
            {overdueList.length
              ? `You have ${overdueList.length} overdue assignment(s). Start with the earliest one.`
              : 'Assignments are ranked by deadline first, then by priority, so the first item is always the best next action.'}
          </Notice>
        </section>
      </div>

      <section className="panel">
        <div className="section-title">
          <h2>Assignments</h2>
          <div className="tabs" role="tablist" aria-label="Filter assignments">
            {[
              ['pending', `Pending (${pendingList.length})`],
              ['overdue', `Overdue (${overdueList.length})`],
              ['completed', `Completed (${completedList.length})`],
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
            title={assignments.length === 0 ? 'No assignments yet' : 'Nothing to show here'}
            message={
              assignments.length === 0
                ? 'Add your first assignment using the form above. Deadlines, urgency and completion rates will be calculated automatically.'
                : 'Switch to another tab to see the rest of your assignments.'
            }
          />
        ) : (
          <div className="list">
            {visible.map((a) => {
              const due = dueLabel(a.deadline)
              const overdue = !a.completed && daysUntil(a.deadline) < 0
              return (
                <article
                  key={a.id}
                  className={`row-card priority-${a.priority}${a.completed ? ' is-done' : ''}${
                    overdue ? ' is-overdue' : ''
                  }`}
                >
                  <div className="row-main">
                    <h3 className={`row-title${a.completed ? ' done' : ''}`}>{a.title}</h3>
                    <div className="row-meta">
                      <span className="chip">{a.courseCode}</span>
                      <span className={`priority-tag priority-${a.priority}`}>
                        {a.priority} priority
                      </span>
                      <span className={`deadline-strong${overdue ? ' overdue' : ''}`}>
                        ◷ {formatDate(a.deadline)}
                      </span>
                      <span className={`badge ${a.completed ? 'badge-green' : due.cls}`}>
                        {a.completed ? 'Completed' : due.text}
                      </span>
                    </div>
                  </div>
                  <div className="row-actions">
                    <button
                      type="button"
                      className={`btn btn-small ${a.completed ? 'btn-ghost' : 'btn-secondary'}`}
                      onClick={() => toggleComplete(a.id)}
                    >
                      {a.completed ? 'Mark pending' : 'Mark completed'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-small"
                      onClick={() => removeAssignment(a.id)}
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
