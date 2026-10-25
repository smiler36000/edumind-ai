import { useMemo } from 'react'
import { EmptyState, Notice, PageHeader, ProgressBar, StatCard } from '../components/Ui'
import {
  daysUntil,
  formatDate,
  formatTimeRange,
  relativeDayLabel,
  todayISO,
} from '../utils/dates'
import { deadlinesWithin, upcomingSessions } from '../utils/stats'
import { AI_AREAS } from '../data/aiAreas'
import './Dashboard.css'

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard({ assignments, sessions, stats, navigate }) {
  const deadlines = useMemo(() => deadlinesWithin(assignments, 7), [assignments])
  const upcoming = useMemo(() => upcomingSessions(sessions), [sessions])
  const todays = useMemo(
    () => sessions.filter((s) => s.date === todayISO()),
    [sessions]
  )
  const hasData = stats.totalActivities > 0

  return (
    <>
      <PageHeader
        title={`${greeting()}, student`}
        subtitle="Welcome to the Student Study Assistant Agent. Plan your study sessions, keep deadlines under control and monitor your progress from one place."
        actions={
          <>
            <button type="button" className="btn btn-primary" onClick={() => navigate('planner')}>
              + Schedule study session
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('assignments')}
            >
              + Add assignment
            </button>
          </>
        }
      />

      {!hasData ? (
        <EmptyState
          title="Let's set up your semester"
          message="You have not entered any data yet. Add your first assignment and schedule a study session - every statistic on this page will then be calculated from your real data."
          action={
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate('assignments')}
            >
              Add my first assignment
            </button>
          }
        />
      ) : null}

      <section aria-label="Key statistics">
        <div className="stat-grid">
          <StatCard
            label="Total assignments"
            value={stats.totalAssignments}
            hint="All assignments recorded"
            icon="▤"
          />
          <StatCard
            label="Pending"
            value={stats.pendingAssignments}
            hint={`${stats.dueSoonAssignments} due within 3 days`}
            tone="amber"
            icon="◔"
            />
          <StatCard
            label="Completed"
            value={stats.completedAssignments}
            hint={`${stats.assignmentCompletionRate}% completion rate`}
            tone="green"
            icon="✓"
          />
          <StatCard
            label="Overdue"
            value={stats.overdueAssignments}
            hint={stats.overdueAssignments ? 'Needs attention today' : 'Nothing overdue'}
            tone={stats.overdueAssignments ? 'red' : 'green'}
            icon="!"
          />
        </div>
      </section>

      <section aria-label="Study statistics">
        <div className="stat-grid">
          <StatCard
            label="Sessions today"
            value={stats.todaySessionsCount}
            hint={`${stats.todayCompletedCount} completed today`}
            tone="violet"
            icon="▤"
          />
          <StatCard
            label="Total sessions"
            value={stats.totalSessions}
            hint="All scheduled study blocks"
            tone="violet"
            icon="◷"
          />
          <StatCard
            label="Completed sessions"
            value={stats.completedSessions}
            hint={`${stats.studyCompletionRate}% completion rate`}
            tone="green"
            icon="✓"
          />
          <StatCard
            label="Overall activity progress"
            value={`${stats.overallProgress}%`}
            hint={`${stats.completedActivities} of ${stats.totalActivities} activities finished`}
            icon="◔"
          />
        </div>
      </section>

      <section className="panel" aria-label="Overall progress">
        <h2 className="panel-title">Overall academic activity progress</h2>
        <p className="panel-subtitle">
          Completed assignments and study sessions compared with everything you have planned.
        </p>
        <ProgressBar percent={stats.overallProgress} label="Semester activities completed" />
        <div className="dash-progress-notes">
          <span>
            Assignments: {stats.completedAssignments}/{stats.totalAssignments}
          </span>
          <span>
            Sessions: {stats.completedSessions}/{stats.totalSessions}
          </span>
        </div>
      </section>

      <div className="grid-2">
        <section className="panel" aria-label="Upcoming deadlines">
          <div className="section-title">
            <h2>Upcoming deadlines</h2>
            <button
              type="button"
              className="btn btn-ghost btn-small"
              onClick={() => navigate('assignments')}
            >
              View all
            </button>
          </div>
          {deadlines.length === 0 ? (
            <EmptyState
              title="No deadlines in the next 7 days"
              message="Assignments added with a deadline within a week will appear here automatically."
            />
          ) : (
            <ul className="deadline-list">
              {deadlines.slice(0, 5).map((a) => {
                const d = daysUntil(a.deadline)
                const overdue = d < 0
                return (
                  <li key={a.id} className={`deadline-item${overdue ? ' is-overdue' : ''}`}>
                    <div>
                      <p className="deadline-title">{a.title}</p>
                      <p className="deadline-meta">
                        {a.courseCode} - priority: {a.priority}
                      </p>
                    </div>
                    <div className="deadline-date">
                      <span className={`badge ${overdue ? 'badge-red' : 'badge-blue'}`}>
                        {relativeDayLabel(a.deadline)}
                      </span>
                      <small>{formatDate(a.deadline)}</small>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section className="panel" aria-label="Today's study sessions">
          <div className="section-title">
            <h2>Today's study sessions</h2>
            <button
              type="button"
              className="btn btn-ghost btn-small"
              onClick={() => navigate('planner')}
            >
              Open planner
            </button>
          </div>
          {todays.length === 0 ? (
            <EmptyState
              title="Nothing planned for today"
              message="Schedule a study session for today and it will show up here with its start time and duration."
            />
          ) : (
            <ul className="deadline-list">
              {todays.map((s) => (
                <li key={s.id} className={`deadline-item${s.completed ? ' is-done' : ''}`}>
                  <div>
                    <p className="deadline-title">{s.subject}: {s.topic}</p>
                    <p className="deadline-meta">{formatTimeRange(s.startTime, s.duration)}</p>
                  </div>
                  <span className={`badge ${s.completed ? 'badge-green' : 'badge-violet'}`}>
                    {s.completed ? 'Completed' : 'Planned'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="grid-2">
        <section className="panel" aria-label="Next actions">
          <div className="section-title">
            <h2>Next actions</h2>
            <button
              type="button"
              className="btn btn-ghost btn-small"
              onClick={() => navigate('assistant')}
            >
              Ask the assistant
            </button>
          </div>
          <ol className="next-list">
            {upcoming.length === 0 ? (
              <li className="next-empty">
                No pending study sessions. Schedule one so the planner can build your day.
              </li>
            ) : (
              upcoming.slice(0, 4).map((s) => (
                <li key={s.id}>
                  <strong>{s.subject}</strong> - {s.topic}{' '}
                  <span>
                    ({s.date === todayISO() ? 'today' : formatDate(s.date)}, {s.startTime})
                  </span>
                </li>
              ))
            )}
            {stats.pendingAssignments > 0 ? (
              <li>
                <strong>{stats.pendingAssignments}</strong> assignment(s) still pending
                {stats.overdueAssignments > 0 ? `, ${stats.overdueAssignments} overdue` : ''}
              </li>
            ) : null}
          </ol>
        </section>

        <section className="panel" aria-label="The four areas of AI">
          <h2 className="panel-title">The four areas of AI in this app</h2>
          <p className="panel-subtitle">Each area maps to features you use every day.</p>
          <div className="area-chips">
            {AI_AREAS.map((area) => (
              <div key={area.id} className="area-chip" style={{ '--area': area.color }}>
                <strong>{area.name}</strong>
                <span>{area.implemented[0]}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Notice tone="info">
        <strong>Assessment note:</strong> the four areas listed above are a provisional
        classification. They will be revised to match the lecturer's confirmed CSM 395 notes.
      </Notice>
    </>
  )
}
