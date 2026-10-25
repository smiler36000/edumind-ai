import { useEffect, useMemo, useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import StudyPlanner from './pages/StudyPlanner'
import AssignmentTracker from './pages/AssignmentTracker'
import Assistant from './pages/Assistant'
import ProgressReports from './pages/ProgressReports'
import { loadValue, saveValue, usePersistentArray } from './utils/storage'
import { getStats, todaySessions } from './utils/stats'
import './App.css'

const THEME_KEY = 'theme'

/**
 * Theme resolution: saved choice first, otherwise the device preference,
 * otherwise light mode.
 */
function getInitialTheme() {
  const saved = loadValue(THEME_KEY, null, (v) => v === 'dark' || v === 'light')
  if (saved) return saved
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

const PAGES = {
  dashboard: Dashboard,
  planner: StudyPlanner,
  assignments: AssignmentTracker,
  assistant: Assistant,
  progress: ProgressReports,
}

function readHash() {
  const hash = window.location.hash.replace('#', '')
  return PAGES[hash] ? hash : 'dashboard'
}

export default function App() {
  const [assignments, setAssignments] = usePersistentArray('assignments', [])
  const [sessions, setSessions] = usePersistentArray('sessions', [])
  const [page, setPage] = useState(readHash)
  const [theme, setTheme] = useState(getInitialTheme)

  // Apply the theme to <html> and remember the choice.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    saveValue(THEME_KEY, theme)
  }, [theme])

  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))

  // Keep the URL hash in sync so refresh keeps the student on the same page.
  useEffect(() => {
    const onHashChange = () => setPage(readHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = (next) => {
    setPage(next)
    window.location.hash = next
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const stats = useMemo(() => getStats(assignments, sessions), [assignments, sessions])
  const todayCount = todaySessions(sessions)

  const PageComponent = PAGES[page] || Dashboard

  const sharedProps = {
    assignments,
    setAssignments,
    sessions,
    setSessions,
    stats,
    navigate,
  }

  return (
    <div className="app-shell">
      <Sidebar
        page={page}
        onNavigate={navigate}
        pendingAssignments={stats.pendingAssignments}
        todaySessions={todayCount}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <main className="app-main">
        <PageComponent {...sharedProps} />
        <footer className="app-footer">
          Student Study Assistant Agent - CSM 395 prototype. Data stays in your browser
          (localStorage). The assistant is rule-based, not a large language model.
        </footer>
      </main>
    </div>
  )
}
