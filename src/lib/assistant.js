// Rule-based study assistant.
//
// This is a demonstration assistant written in plain JavaScript. It matches
// keywords in the student's question, applies hand-written rules and, where
// useful, reads the student's own assignments and study sessions. It is NOT
// connected to a large language model or any external AI service.

import { daysUntil, formatDate, relativeDayLabel, todayISO } from '../utils/dates'
import {
  buildRecommendations,
  getStats,
  nextAssignment,
  rankAssignments,
  upcomingSessions,
} from '../utils/stats'

export const ASSISTANT_DISCLOSURE =
  'This assistant is a rule-based JavaScript prototype. It matches keywords in your ' +
  'question and applies hand-written rules - it is not connected to a large language ' +
  'model or any external AI service.'

export const EXAMPLE_QUESTIONS = [
  'What should I study first?',
  'Suggest a study timetable for me',
  'How do I prepare for examinations?',
  'How can I manage my time better?',
  'I keep procrastinating. What should I do?',
  'How do I revise a difficult topic?',
  'How should I prioritise my assignments?',
  'How do I prepare for CSM 395?',
  'How do I plan my agent project?',
  'Summarise my progress',
]

const has = (text, words) => words.some((w) => text.includes(w))

function sessionsBlock(sessions) {
  const list = upcomingSessions(sessions).slice(0, 5)
  if (!list.length) {
    return 'You have no pending study sessions scheduled. Add a few in the Study Planner first so I can build the timetable around them.'
  }
  const lines = list.map((s, i) => {
    const label =
      s.date === todayISO()
        ? 'today'
        : `${formatDate(s.date)} (${relativeDayLabel(s.date)})`
    return `${i + 1}. ${s.subject} - ${s.topic} | ${label}, ${s.startTime || 'time not set'} | ${s.duration} min`
  })
  return (
    'Based on the sessions you already scheduled:\n' +
    lines.join('\n') +
    '\n\nSuggested daily structure: 1 focused 45-60 minute block in the morning, one ' +
    'short review block after lunch, and a 20 minute recap before sleeping. Keep one ' +
    'day per week free for catch-up.'
  )
}

function priorityBlock(assignments) {
  const pending = rankAssignments(assignments).slice(0, 4)
  if (!pending.length) {
    return 'You have no pending assignments, so there is nothing to prioritise right now. Well done - use the time for revision.'
  }
  const lines = pending.map((a) => {
    const d = daysUntil(a.deadline)
    const when =
      d === null
        ? 'no deadline set'
        : d < 0
          ? `OVERDUE by ${Math.abs(d)} day(s)`
          : d === 0
            ? 'due today'
            : `due in ${d} day(s)`
    return `- ${a.title} (${a.deadline ? formatDate(a.deadline) : 'no date'}) - ${a.priority} priority - ${when}`
  })
  return (
    'Work on them in this order (earliest deadline first, then priority):\n' +
    lines.join('\n') +
    '\n\nRule of thumb: finish overdue and due-today items before starting anything new.'
  )
}

function studyFirstBlock(assignments, sessions) {
  const today = todayISO()
  const lines = []
  const urgent = assignments
    .filter((a) => {
      const d = daysUntil(a.deadline)
      return !a.completed && d !== null && d <= 3
    })
    .sort((a, b) => (a.deadline < b.deadline ? -1 : 1))
    .slice(0, 3)
  const todaySessions = sessions.filter((s) => s.date === today && !s.completed)

  if (urgent.length) {
    lines.push('Study/work order based on your deadlines:')
    urgent.forEach((a, i) => {
      const d = daysUntil(a.deadline)
      const when = d < 0 ? `overdue by ${Math.abs(d)} day(s)` : d === 0 ? 'due today' : `due in ${d} day(s)`
      lines.push(`${i + 1}. ${a.courseCode}: ${a.title} - ${when}, ${a.priority} priority`)
    })
  }
  if (todaySessions.length) {
    lines.push('', 'Sessions you already planned for today:')
    todaySessions.forEach((s) =>
      lines.push(`- ${s.subject}: ${s.topic} (${s.duration} min at ${s.startTime})`)
    )
  }
  if (!lines.length) {
    lines.push(
      'You have no urgent deadline and no session planned for today. Pick the topic you understand least, schedule a 45 minute block in the Study Planner, and start with the part you find hardest while your mind is fresh.'
    )
  } else {
    lines.push(
      '',
      'General rule: start with the nearest deadline, then study your weakest topic in a 45 minute block. Record each block in the Study Planner so your progress stays visible.'
    )
  }
  return lines.join('\n')
}

function progressBlock(assignments, sessions) {
  const s = getStats(assignments, sessions)
  if (s.totalActivities === 0) {
    return 'I do not have any data yet. Add an assignment in the Assignment Tracker or schedule a session in the Study Planner, then ask me again and I will summarise your progress.'
  }
  return [
    `Assignments: ${s.completedAssignments}/${s.totalAssignments} completed (${s.assignmentCompletionRate}%), ${s.pendingAssignments} pending, ${s.overdueAssignments} overdue.`,
    `Study sessions: ${s.completedSessions}/${s.totalSessions} completed (${s.studyCompletionRate}%), ${s.todaySessionsCount} planned for today.`,
    `Overall activity progress: ${s.overallProgress}%.`,
  ].join('\n')
}

function timetableBlock(sessions) {
  const base = sessionsBlock(sessions)
  return (
    'Here is a practical study timetable you can follow:\n' +
    '- 08:00 - 09:30: hardest topic of the day (deep work, no phone)\n' +
    '- 10:00 - 11:00: lecture review and notes tidy-up\n' +
    '- 14:00 - 15:00: assignment work\n' +
    '- 16:00 - 16:45: practice questions or coding exercises\n' +
    '- 20:00 - 20:20: quick recap of what you learned\n\n' +
    base
  )
}

function csm395Block() {
  return [
    'My suggested plan for passing CSM 395:',
    '1. Attend every lecture and re-read the notes within 24 hours while they are fresh.',
    '2. Practise the concepts yourself - build small examples instead of only reading.',
    '3. Record every assignment deadline in the Assignment Tracker immediately.',
    '4. Ask the lecturer for clarification early whenever a concept is unclear.',
    '5. Revise in small weekly blocks rather than cramming before the exam.',
    '6. For the project, start with a narrow problem, build the prototype, then add features only after the core works.',
  ].join('\n')
}

function projectBlock() {
  return [
    'A manageable plan for the CSM 395 agent project:',
    '1. Define the problem: students lose track of deadlines and study time.',
    '2. Choose the users: undergraduate students managing several courses.',
    '3. List functional requirements: study planner, assignment tracker, rule-based assistant, progress reports.',
    '4. Design the data: assignments and study sessions stored locally in the browser.',
    '5. Build a small working slice first (planner + tracker), then add the assistant.',
    '6. Test each page with real sample data and fix the errors you find.',
    '7. Document which AI ideas are actually implemented and which are future work.',
    'This application follows exactly that sequence.',
  ].join('\n')
}

function revisionBlock() {
  return [
    'A dependable method for revising a difficult topic:',
    '1. Read the section once and write the key idea in one sentence.',
    '2. Explain it out loud as if teaching a classmate - the gaps become visible.',
    '3. Work one practice problem without looking at the solution.',
    '4. Check the answer, correct your mistake, and repeat with a similar problem.',
    '5. Re-test yourself after two days, then after one week (spaced repetition).',
    'If a topic stays difficult after two attempts, add it to the top of your study planner and ask for clarification in the next lecture.',
  ].join('\n')
}

function examBlock() {
  return [
    'How to prepare for examinations:',
    '1. Collect the syllabus and past questions, then list every topic that can be examined.',
    '2. Rate each topic: confident, partly confident, or weak.',
    '3. Schedule weak topics first in the Study Planner.',
    '4. Practise under timed conditions - writing answers from memory, not just re-reading.',
    '5. In the final week, switch to summary sheets and past papers only.',
    '6. Sleep properly the night before; a tired mind recalls much less.',
  ].join('\n')
}

function timeBlock() {
  return [
    'Practical time-management rules that work for students:',
    '1. Plan tomorrow before you sleep - decide the single most important task.',
    '2. Work in 45 minute focus blocks with 10 minute breaks.',
    '3. Put every deadline in one place (the Assignment Tracker) so nothing is remembered mentally.',
    '4. Say no to low-value commitments during exam or deadline periods.',
    '5. Review your week every Sunday and move unfinished sessions forward.',
  ].join('\n')
}

function procrastinationBlock() {
  return [
    'If you keep postponing work, try these steps:',
    '1. Reduce the first step until it is almost too small to fail: "open the document and write one heading".',
    '2. Set a 10 minute timer - you only have to continue if you want to after it ends.',
    '3. Remove the distraction physically: phone in another room, notifications off.',
    '4. Schedule the dreaded task at your lowest-energy time slot rather than avoiding it all day.',
    '5. Mark each finished session as completed in the planner - visible progress is a strong motivator.',
  ].join('\n')
}

/**
 * Main entry point.
 * @param {string} question raw student question
 * @param {{assignments:Array, sessions:Array}} data application data
 * @returns {string} assistant reply
 */
export function askAssistant(question, data) {
  const raw = typeof question === 'string' ? question.trim() : ''
  if (!raw) {
    return 'Please type a question first. You can also click one of the example questions below.'
  }

  const text = raw.toLowerCase()
  const assignments = (data && data.assignments) || []
  const sessions = (data && data.sessions) || []

  // Greetings and meta questions.
  if (has(text, ['hello', 'hi ', 'hey', 'good morning', 'good afternoon', 'good evening']) && text.length < 25) {
    return 'Hello! I am your rule-based study assistant. Ask me about study timetables, revision, assignments, time management or preparing for CSM 395.'
  }
  if (has(text, ['what can you do', 'help', 'who are you', 'what are you'])) {
    return (
      'I can help with:\n' +
      '- Suggesting a study timetable\n' +
      '- Prioritising your assignments\n' +
      '- Planning revision for difficult topics\n' +
      '- Preparing for examinations and CSM 395\n' +
      '- Managing time and avoiding procrastination\n' +
      '- Planning the CSM 395 agent project\n' +
      '- Summarising your recorded progress\n\n' +
      ASSISTANT_DISCLOSURE
    )
  }

  // Progress / status.
  if (has(text, ['progress', 'summary', 'summarise', 'summarize', 'status', 'how am i doing', 'statistic'])) {
    return progressBlock(assignments, sessions)
  }

  // What to study right now (study-specific form of "what first").
  if (has(text, ['study first', 'what to study', 'which topic', 'start studying', 'study now'])) {
    return studyFirstBlock(assignments, sessions)
  }

  // Procrastination and motivation.
  if (has(text, ['procrast', 'lazy', 'motivation', 'motivated', 'concentrat', 'focus', 'distract'])) {
    return procrastinationBlock()
  }

  // Timetable.
  if (has(text, ['timetable', 'schedule', 'plan my week', 'weekly plan', 'routine', 'study plan'])) {
    return timetableBlock(sessions)
  }

  // Examination preparation.
  if (has(text, ['exam', 'test', 'finals', 'invigil'])) {
    return examBlock()
  }

  // Revision of difficult topics.
  if (has(text, ['revis', 'difficult topic', 'hard topic', 'understand', 'confusing', 'weak topic'])) {
    return revisionBlock()
  }

  // Time management.
  if (has(text, ['time manage', 'managing time', 'time better', 'busy', 'too much work', 'balance'])) {
    return timeBlock()
  }

  // Prioritisation of assignments and deadlines.
  if (
    has(text, ['priorit', 'which assignment', 'what assignment', 'order', 'urgent', 'deadline', 'overdue', 'next task', 'first'])
  ) {
    const next = nextAssignment(assignments)
    const head = next
      ? `Your next action should be: "${next.title}" (${next.courseCode}). Reason: ${
          daysUntil(next.deadline) < 0
            ? 'it is already overdue'
            : `its deadline is ${formatDate(next.deadline)}, ${relativeDayLabel(next.deadline).toLowerCase()}`
        }, and its priority is ${next.priority}.\n\n`
      : 'There is no pending assignment recorded, so focus on your study sessions.\n\n'
    return head + priorityBlock(assignments)
  }

  // CSM 395 course preparation.
  if (has(text, ['csm 395', 'csm395', 'pass this course', 'course'])) {
    return csm395Block()
  }

  // Project planning.
  if (has(text, ['project', 'agent', 'prototype', 'development'])) {
    return projectBlock()
  }

  // Today's plan.
  if (has(text, ['today', 'this day', 'tonight'])) {
    const todaySessions = sessions.filter((s) => s.date === todayISO() && !s.completed)
    const todayTasks = assignments.filter(
      (a) => !a.completed && daysUntil(a.deadline) !== null && daysUntil(a.deadline) <= 0
    )
    const lines = []
    if (todayTasks.length) {
      lines.push('Assignments needing attention today:')
      todayTasks.forEach((a) => lines.push(`- ${a.title} (${a.courseCode})`))
    }
    if (todaySessions.length) {
      lines.push('Sessions planned for today:')
      todaySessions.forEach((s) =>
        lines.push(`- ${s.subject}: ${s.topic} at ${s.startTime} for ${s.duration} min`)
      )
    }
    if (!lines.length) {
      return 'Nothing urgent is scheduled for today. Use the free time for revision - add a session in the Study Planner and I will remind you of it here.'
    }
    return lines.join('\n')
  }

  // Recommendations built from recorded activity.
  if (
    has(text, ['recommend', 'advice', 'suggest', 'tip', 'what next', 'what should i do', 'what now'])
  ) {
    const tips = buildRecommendations(assignments, sessions)
    if (!tips.length) {
      return 'Add an assignment or a study session first, and I will give you data-driven advice based on your own record.'
    }
    return 'Based on your recorded activity:\n' + tips.map((t, i) => `${i + 1}. [${t.area}] ${t.text}`).join('\n')
  }

  // Fallback: still useful, never a generic shrug.
  return (
    'I did not recognise that question. My rule-based engine understands topics such as:\n' +
    '- study timetables and daily plans\n' +
    '- examination preparation\n' +
    '- revision of difficult topics\n' +
    '- assignment prioritisation and deadlines\n' +
    '- time management and procrastination\n' +
    '- preparing for CSM 395 and the agent project\n' +
    '- a summary of your recorded progress\n\n' +
    'Try rephrasing your question or pick one of the example questions.'
  )
}
