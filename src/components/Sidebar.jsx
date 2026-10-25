import './Sidebar.css'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '▦', hint: 'Overview of your semester' },
  { id: 'planner', label: 'Study Planner', icon: '▤', hint: 'Schedule study sessions' },
  { id: 'assignments', label: 'Assignments', icon: '✓', hint: 'Track deadlines' },
  { id: 'assistant', label: 'AI Assistant', icon: '✦', hint: 'Ask for study advice' },
  { id: 'progress', label: 'Progress & Reports', icon: '◔', hint: 'Statistics and charts' },
]

function SunIcon() {
  return (
    <svg
      className="theme-icon-svg"
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      className="theme-icon-svg"
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  )
}

export default function Sidebar({
  page,
  onNavigate,
  pendingAssignments,
  todaySessions,
  theme,
  onToggleTheme,
}) {
  const isDark = theme === 'dark'

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo" aria-hidden="true">
          S
        </div>
        <div className="sidebar-brand-text">
          <strong>Student Study</strong>
          <span>Assistant Agent</span>
        </div>
        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-pressed={isDark}
          aria-label={
            isDark ? 'Switch to light mode' : 'Switch to dark mode'
          }
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <span
            className={`theme-icon theme-icon-sun${!isDark ? ' theme-icon-active' : ''}`}
            aria-hidden="true"
          >
            <SunIcon />
          </span>
          <span
            className={`theme-icon theme-icon-moon${isDark ? ' theme-icon-active' : ''}`}
            aria-hidden="true"
          >
            <MoonIcon />
          </span>
          <span className="theme-label">{isDark ? 'Dark' : 'Light'}</span>
        </button>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => {
          const active = page === item.id
          let badge = null
          if (item.id === 'assignments' && pendingAssignments > 0) badge = pendingAssignments
          if (item.id === 'planner' && todaySessions > 0) badge = todaySessions
          return (
            <button
              key={item.id}
              type="button"
              className={`nav-item${active ? ' nav-item-active' : ''}`}
              onClick={() => onNavigate(item.id)}
              aria-current={active ? 'page' : undefined}
            >
              <span className="nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="nav-labels">
                <span className="nav-label">{item.label}</span>
                <span className="nav-hint">{item.hint}</span>
              </span>
              {badge ? <span className="nav-badge">{badge}</span> : null}
            </button>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <p className="sidebar-note">CSM 395 prototype</p>
        <p className="sidebar-note sidebar-note-dim">
          Data is stored only in this browser (localStorage).
        </p>
      </div>
    </aside>
  )
}
