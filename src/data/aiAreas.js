// The four areas of AI used by this project.
//
// IMPORTANT: This classification is PROVISIONAL. It has been adopted because no
// lecture notes from CSM 395 were available in the workspace to confirm the
// lecturer's exact framework. Each entry keeps a `keywordAliases` list so the
// terms can be replaced easily once the confirmed course notes are provided.

export const CLASSIFICATION_NOTICE =
  'Provisional classification: the four areas below are a working assumption made ' +
  'because the lecturer’s notes were not available in this workspace. They must be ' +
  'updated to match the official CSM 395 course material before submission.'

export const AI_AREAS = [
  {
    id: 'learning',
    name: 'Learning',
    color: '#2563eb',
    definition:
      'The area of AI concerned with systems that improve their performance by acquiring knowledge from data or experience, including pattern recognition, classification and prediction.',
    studentMeaning:
      'For a student, learning means building knowledge over time and using evidence of past work to decide what to study next.',
    implemented: [
      'Completed study sessions are recorded and summarised in statistics.',
      'Assignment completion history is tracked over the semester.',
      'Progress percentages show how much planned work has actually been finished.',
      'Recommendations are generated from the recorded activity history.',
    ],
    honestNote:
      'The prototype performs progress tracking and simple data analysis. It does not train a machine-learning model, so it is learning support rather than machine learning itself.',
  },
  {
    id: 'reasoning',
    name: 'Reasoning',
    color: '#7c3aed',
    definition:
      'The area of AI that draws conclusions from known facts by applying rules and logic, such as inferring the most likely or most urgent outcome from a set of conditions.',
    studentMeaning:
      'For a student, reasoning means using deadlines, priority levels and completion status to decide what to do and in what order.',
    implemented: [
      'Overdue assignments are detected by comparing deadlines with today’s date.',
      'Assignments are ranked by deadline, urgency and priority.',
      'The assistant names the single next assignment to work on.',
      'Revision advice is triggered when a deadline is close.',
    ],
    honestNote:
      'The reasoning is implemented as deterministic if/else rules written by hand, not as an automated theorem prover or probabilistic inference engine.',
  },
  {
    id: 'problem-solving',
    name: 'Problem-solving',
    color: '#0891b2',
    definition:
      'The area of AI focused on finding a path from a current state to a desired goal, for example by decomposing a goal into steps, searching options and choosing a workable plan.',
    studentMeaning:
      'For a student, problem-solving means turning a large, vague goal such as "pass this semester" into small, achievable daily actions.',
    implemented: [
      'Large goals are broken into scheduled study sessions with a date and duration.',
      'A suggested timetable is produced for a student who asks for one.',
      'Unfinished work is organised into a manageable next action.',
      'The planner separates upcoming, today’s and completed sessions.',
    ],
    honestNote:
      'The plan generation uses fixed scheduling rules and templates. It does not run a search algorithm such as A* or constraint solving.',
  },
  {
    id: 'perception',
    name: 'Perception',
    color: '#db2777',
    definition:
      'The area of AI that interprets information coming from the environment - text, images, sound or sensor data - so that the system can understand what it is being given.',
    studentMeaning:
      'For a student, perception means the system correctly interpreting what is typed: dates, times, priorities, course codes and free-text questions.',
    implemented: [
      'Assignment deadlines and study-session dates are parsed and interpreted.',
      'Priority selections and completion status are read as structured input.',
      'Free-text questions are analysed with keyword matching to detect intent.',
      'Invalid or incomplete input is identified and reported to the user.',
    ],
    honestNote:
      'This is text and data interpretation only. The prototype has no computer vision, speech recognition or sensor processing.',
  },
]

export function getArea(id) {
  return AI_AREAS.find((a) => a.id === id) || AI_AREAS[0]
}
