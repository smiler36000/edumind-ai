# Student Study Assistant Agent

A functional prototype of an AI-based student study assistant, developed for **CSM 395**.

## Purpose

The application helps a university student organise the semester from one place: schedule study sessions, manage assignment deadlines, ask basic study-planning questions, and monitor progress. It is the practical prototype UI accompanying the written assignment in [`CSM395_Assignment.md`](./CSM395_Assignment.md).

The project also demonstrates the **four provisional areas of AI** (Learning, Reasoning, Problem-solving, Perception) through features that a student can actually use.

## Main features

- **Dashboard** - live statistics (total, pending, completed, overdue assignments; today's, total and completed sessions; overall activity progress), an overall progress bar, upcoming deadlines within 7 days, today's sessions, next actions, and quick-action buttons. Empty states appear when no data has been entered.
- **Study Planner** - add a session (subject/course code, topic, date, start time, duration), filter by all/today/upcoming/completed, mark completed, delete. Required fields are validated and sessions persist in `localStorage`.
- **Assignment Tracker** - add an assignment (title, course code, deadline, priority), view pending/overdue/completed tabs, mark completed, delete. Overdue and urgent deadlines are highlighted with colour badges; past deadlines are rejected by the form.
- **AI Study Assistant** - chat-style, rule-based assistant covering study timetables, examination preparation, revision of difficult topics, assignment prioritisation, time management, procrastination, CSM 395 preparation, project planning, and progress summaries. It reads the student's own saved data where relevant. Includes example questions, a clear-chat button, and empty-message handling.
- **Progress & Reports** - total/completed/pending/overdue assignments, total and completed sessions, session and assignment completion rates, donut charts, progress bars, rule-generated recommendations, and a priority queue. No grades or exam results are ever invented.
- **Responsive layout** - sidebar navigation on desktop, horizontal scrolling navigation on mobile.

## Technologies used

- React 18 + JavaScript (ES modules)
- Vite 5 (dev server and production build)
- HTML5 and CSS3 (Grid, Flexbox, media queries) - no CSS framework
- Browser `localStorage` for persistence
- No backend, database, authentication, paid API, or API key is required

## Project structure

```
StudentStudyAssistant/
├── CSM395_Assignment.md      # Written academic assignment
├── README.md
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx              # React entry point
    ├── App.jsx               # Layout, navigation and shared state
    ├── App.css               # Layout, forms, buttons, list rows
    ├── index.css             # Global styles
    ├── components/
    │   ├── Sidebar.jsx/.css  # Responsive navigation
    │   └── Ui.jsx/.css       # PageHeader, StatCard, ProgressBar, EmptyState, Notice
    ├── pages/
    │   ├── Dashboard.jsx/.css
    │   ├── StudyPlanner.jsx  # + ListPages.css (shared list styles)
    │   ├── AssignmentTracker.jsx
    │   ├── Assistant.jsx/.css
    │   └── ProgressReports.jsx/.css
    ├── lib/
    │   └── assistant.js      # Rule-based assistant engine
    ├── data/
    │   └── aiAreas.js        # The four provisional areas of AI (single source of truth)
    └── utils/
        ├── storage.js        # Safe localStorage load/save + usePersistentArray hook
        ├── dates.js          # Date parsing, formatting, relative labels
        └── stats.js          # All statistics, ranking, and recommendations
```

## Installation

```bash
npm install
```

## Starting the application

```bash
npm run dev
```

Then open the URL printed in the terminal (default `http://localhost:5173`).

## Building for production

```bash
npm run build
```

The compiled site is written to `dist/`. To preview the production build locally:

```bash
npm run preview
```

## How data is saved

All data is stored in the browser's **`localStorage`** under two keys:

- `ssa.assignments` - array of assignment objects
- `ssa.sessions` - array of study session objects

Nothing is sent to a server. Data survives page refreshes and browser restarts on the same device and profile. Storage failures or malformed/corrupted JSON are handled safely: the application falls back to an empty list and continues to work. Clearing site data (or using private browsing) will remove the saved records.

## The rule-based assistant

`src/lib/assistant.js` implements a **rule-based demonstration assistant** in plain JavaScript. It:

1. normalises the student's question,
2. matches it against keyword sets (timetable, exam, revision, prioritisation, procrastination, CSM 395, project, progress, today...),
3. returns a hand-written response, and
4. where useful, uses the student's real saved assignments and sessions (for example, ranking the next assignment by deadline, urgency, and priority).

**It is not connected to a large language model or any external AI service**, requires no API key, and cannot answer questions outside its defined topics. This disclosure is also shown inside the application.

## Known limitations

- The assistant only understands its predefined topics; unrecognised questions receive a helpful redirect listing what it can answer.
- The four areas of AI used in the interface are a **provisional classification** (Learning, Reasoning, Problem-solving, Perception) and must be updated to the lecturer's confirmed CSM 395 notes. The terms live in `src/data/aiAreas.js` for easy replacement.
- Data is local to one browser; there is no sync, export, or backup feature.
- Statistics report activity only - no grades, marks, or examination results exist in the system.
- Single user, no authentication; testing is manual (no automated test suite).

## Assignment document

See [`CSM395_Assignment.md`](./CSM395_Assignment.md) for the full written response covering the four areas of AI, the semester plan, the agent project plan, the prototype description, and limitations.
