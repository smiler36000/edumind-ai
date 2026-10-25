// Statistics calculated from the student's saved assignments and sessions.
// Every figure shown in the dashboard and progress page comes from here,
// so the numbers always reflect the real data currently in the browser.

import { daysUntil, percentOf, todayISO } from './dates'

const PRIORITY_RANK = { high: 3, medium: 2, low: 1 }

export function getStats(assignments, sessions) {
  const totalAssignments = assignments.length
  const completedAssignments = assignments.filter((a) => a.completed).length
  const pendingAssignments = totalAssignments - completedAssignments
  const overdueAssignments = assignments.filter(
    (a) => !a.completed && daysUntil(a.deadline) !== null && daysUntil(a.deadline) < 0
  ).length
  const dueSoonAssignments = assignments.filter((a) => {
    const d = daysUntil(a.deadline)
    return !a.completed && d !== null && d >= 0 && d <= 3
  }).length

  const totalSessions = sessions.length
  const completedSessions = sessions.filter((s) => s.completed).length
  const pendingSessions = totalSessions - completedSessions
  const today = todayISO()
  const todaySessions = sessions.filter((s) => s.date === today)
  const todayCompleted = todaySessions.filter((s) => s.completed).length

  const assignmentCompletionRate = percentOf(completedAssignments, totalAssignments)
  const studyCompletionRate = percentOf(completedSessions, totalSessions)

  // Overall academic activity progress = completed items / total items.
  const totalActivities = totalAssignments + totalSessions
  const completedActivities = completedAssignments + completedSessions
  const overallProgress = percentOf(completedActivities, totalActivities)

  return {
    totalAssignments,
    completedAssignments,
    pendingAssignments,
    overdueAssignments,
    dueSoonAssignments,
    totalSessions,
    completedSessions,
    pendingSessions,
    todaySessionsCount: todaySessions.length,
    todayCompletedCount: todayCompleted,
    assignmentCompletionRate,
    studyCompletionRate,
    overallProgress,
    totalActivities,
    completedActivities,
  }
}

/** Pending assignments sorted by urgency: overdue first, then deadline, then priority. */
export function rankAssignments(assignments) {
  return [...assignments]
    .filter((a) => !a.completed)
    .sort((a, b) => {
      const da = daysUntil(a.deadline)
      const db = daysUntil(b.deadline)
      const aOver = da !== null && da < 0 ? 0 : 1
      const bOver = db !== null && db < 0 ? 0 : 1
      if (aOver !== bOver) return aOver - bOver
      if (da !== db) return (da ?? 0) - (db ?? 0)
      return (PRIORITY_RANK[b.priority] || 0) - (PRIORITY_RANK[a.priority] || 0)
    })
}

/** The single next assignment the student should work on. */
export function nextAssignment(assignments) {
  return rankAssignments(assignments)[0] || null
}

/** Sessions planned for today (completed and pending). */
export function todaySessions(sessions) {
  const today = todayISO()
  return sessions.filter((s) => s.date === today)
}

/** Pending study sessions sorted by date then start time. */
export function upcomingSessions(sessions) {
  return [...sessions]
    .filter((s) => !s.completed)
    .sort((a, b) => {
      if (a.date !== b.date) return a.date < b.date ? -1 : 1
      return (a.startTime || '').localeCompare(b.startTime || '')
    })
}

/** Assignments with a deadline within the next `days` days (including overdue). */
export function deadlinesWithin(assignments, days = 7) {
  return assignments
    .filter((a) => {
      const d = daysUntil(a.deadline)
      return !a.completed && d !== null && d <= days
    })
    .sort((a, b) => (a.deadline < b.deadline ? -1 : 1))
}

/**
 * Recommendations derived from recorded activity.
 * This is deterministic rule-based analysis, not machine learning.
 */
export function buildRecommendations(assignments, sessions) {
  const tips = []
  const stats = getStats(assignments, sessions)
  const next = nextAssignment(assignments)

  if (next) {
    const d = daysUntil(next.deadline)
    const urgency =
      d === null
        ? 'with no deadline recorded'
        : d < 0
          ? `was due ${Math.abs(d)} day(s) ago`
          : d === 0
            ? 'is due today'
            : `is due in ${d} day(s)`
    tips.push({
      area: 'Reasoning',
      text: `Start with "${next.title}" (${next.courseCode}) - it ${urgency} and has ${next.priority} priority.`,
    })
  }

  if (stats.overdueAssignments > 0) {
    tips.push({
      area: 'Problem-solving',
      text: `You have ${stats.overdueAssignments} overdue assignment(s). Break them into small steps and finish the earliest one first.`,
    })
  }

  if (stats.totalSessions > 0 && stats.studyCompletionRate < 50) {
    tips.push({
      area: 'Learning',
      text: `Only ${stats.studyCompletionRate}% of your planned sessions were completed. Plan shorter sessions of 30-45 minutes to make them easier to finish.`,
    })
  } else if (stats.completedSessions > 0) {
    tips.push({
      area: 'Learning',
      text: `You have completed ${stats.completedSessions} study session(s). Re-read your weakest topic from those sessions before the next lecture.`,
    })
  }

  const unfinishedToday = sessions.filter(
    (s) => s.date === todayISO() && !s.completed
  ).length
  if (unfinishedToday > 0) {
    tips.push({
      area: 'Problem-solving',
      text: `You have ${unfinishedToday} session(s) planned for today. Choose the shortest one first to build momentum.`,
    })
  }

  if (stats.totalActivities === 0) {
    tips.push({
      area: 'Learning',
      text: 'Add your first assignment and study session so the assistant can analyse your workload and give specific advice.',
    })
  }

  return tips
}
