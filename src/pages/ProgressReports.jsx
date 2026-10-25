import { useMemo } from 'react'
import { EmptyState, Notice, PageHeader, ProgressBar, StatCard } from '../components/Ui'
import { AI_AREAS } from '../data/aiAreas'
import { buildRecommendations, getStats, rankAssignments } from '../utils/stats'
import { formatDate, relativeDayLabel } from '../utils/dates'
import './Progress.css'

function Donut({ percent, label }) {
  const safe = Math.max(0, Math.min(100, Number(percent) || 0))
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (safe / 100) * circumference
  return (
    <div className="donut">
      <svg viewBox="0 0 130 130" width="130" height="130" role="img" aria-label={label}>
        <circle
          className="donut-track"
          cx="65"
          cy="65"
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="14"
        />
        <circle
          cx="65"
          cy="65"
          r={radius}
          fill="none"
          stroke="url(#grad)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 65 65)"
        />
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <text x="65" y="70" textAnchor="middle" className="donut-value">
          {safe}%
        </text>
      </svg>
      <p className="donut-label">{label}</p>
    </div>
  )
}

export default function ProgressReports({ assignments, sessions, stats }) {
  const recommendations = useMemo(
    () => buildRecommendations(assignments, sessions),
    [assignments, sessions]
  )
  const nextUp = useMemo(() => rankAssignments(assignments).slice(0, 5), [assignments])

  if (stats.totalActivities === 0) {
    return (
      <>
        <PageHeader
          title="Progress & Reports"
          subtitle="All figures below are calculated from your own saved assignments and study sessions."
        />
        <EmptyState
          title="No data to report yet"
          message="Add at least one assignment or schedule a study session, and every statistic on this page will be generated automatically from that data."
        />
        <Notice tone="info">
          This page never invents grades, examination results or academic performance data - it
          only reports the activities you have recorded.
        </Notice>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Progress & Reports"
        subtitle="Meaningful statistics calculated live from your saved assignments and study sessions. Every figure updates as soon as the data changes."
      />

      <div className="stat-grid">
        <StatCard label="Total assignments" value={stats.totalAssignments} icon="▤" />
        <StatCard
          label="Completed assignments"
          value={stats.completedAssignments}
          tone="green"
          icon="✓"
        />
        <StatCard label="Pending assignments" value={stats.pendingAssignments} tone="amber" icon="◔" />
        <StatCard
          label="Overdue assignments"
          value={stats.overdueAssignments}
          tone={stats.overdueAssignments ? 'red' : 'green'}
          icon="!"
        />
        <StatCard label="Total study sessions" value={stats.totalSessions} tone="violet" icon="◷" />
        <StatCard
          label="Completed sessions"
          value={stats.completedSessions}
          tone="green"
          icon="✓"
        />
        <StatCard
          label="Session completion rate"
          value={`${stats.studyCompletionRate}%`}
          tone="violet"
          icon="◔"
        />
        <StatCard
          label="Assignment completion rate"
          value={`${stats.assignmentCompletionRate}%`}
          icon="◔"
        />
      </div>

      <div className="grid-2">
        <section className="panel">
          <h2 className="panel-title">Completion rates</h2>
          <p className="panel-subtitle">Completed work compared with planned work.</p>
          <div className="donut-row">
            <Donut percent={stats.studyCompletionRate} label="Study sessions" />
            <Donut percent={stats.assignmentCompletionRate} label="Assignments" />
            <Donut percent={stats.overallProgress} label="Overall activity" />
          </div>
          <div className="stack">
            <ProgressBar
              percent={stats.studyCompletionRate}
              label="Study-session completion rate"
            />
            <ProgressBar
              percent={stats.assignmentCompletionRate}
              tone="violet"
              label="Assignment completion rate"
            />
            <ProgressBar percent={stats.overallProgress} tone="green" label="Overall progress" />
          </div>
        </section>

        <section className="panel">
          <h2 className="panel-title">Recommendations</h2>
          <p className="panel-subtitle">
            Generated by simple rules from your recorded activity (learning-related support, not a
            trained machine-learning model).
          </p>
          <ol className="rec-list">
            {recommendations.map((tip, i) => (
              <li key={i}>
                <span className={`badge badge-${areaTone(tip.area)}`}>{tip.area}</span>
                <p>{tip.text}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className="panel">
        <h2 className="panel-title">Priority queue</h2>
        <p className="panel-subtitle">
          Reasoning rules: overdue first, then nearest deadline, then highest priority.
        </p>
        {nextUp.length === 0 ? (
          <EmptyState
            title="No pending assignments"
            message="You have finished every assignment on record. Use the extra time for revision."
          />
        ) : (
          <div className="queue">
            {nextUp.map((a, i) => (
              <div key={a.id} className="queue-item">
                <span className="queue-rank">{i + 1}</span>
                <div>
                  <p className="queue-title">{a.title}</p>
                  <p className="queue-meta">
                    {a.courseCode} - due {formatDate(a.deadline)} (
                    {relativeDayLabel(a.deadline)}) - {a.priority} priority
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="panel">
        <h2 className="panel-title">How the four areas appear on this page</h2>
        <div className="area-grid">
          {AI_AREAS.map((area) => (
            <div key={area.id} className="area-card" style={{ '--area': area.color }}>
              <h3>{area.name}</h3>
              <p className="area-implemented">{area.honestNote}</p>
              <ul>
                {area.implemented.slice(0, 2).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <Notice tone="warning">
        Figures describe activity only (sessions and assignments recorded in this browser). No
        grades, marks or examination results are recorded or calculated anywhere in this prototype.
      </Notice>
    </>
  )
}

function areaTone(area) {
  if (area === 'Learning') return 'blue'
  if (area === 'Reasoning') return 'violet'
  if (area === 'Problem-solving') return 'amber'
  return 'slate'
}
