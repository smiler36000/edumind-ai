# CSM 395: Application of the Four Areas of AI to Semester Activities and Development of an AI Agent

## 1. Introduction

This assignment asks me to use the four areas of artificial intelligence to explain how I intend to organise my academic activities for the semester, and then to demonstrate the practical side of that plan by developing a prototype user interface for an AI-based agent.

The agent I propose is the **Student Study Assistant Agent**, a web application that helps a university student plan study sessions, manage assignment deadlines, obtain basic study-planning advice, and monitor academic progress. The prototype was implemented as part of this submission, so the reader can interact with a working interface rather than only read a description of one.

The purpose of the assignment is therefore twofold: (i) to show that I can map AI concepts onto real student activities such as studying, doing assignments, preparing for CSM 395, and building a project, and (ii) to show that I can translate one of those mapped ideas into a functional software prototype with a clear user interface.

## 2. The Four Areas of AI

### 2.1 Status of the classification used in this report

The workspace made available for this project contained no lecture notes, slides, or assignment materials from CSM 395. I therefore could not verify which classification of "the four areas of AI" my lecturer teaches. To avoid presenting an unverified framework as fact, I use a clearly labelled **provisional classification** throughout this report:

1. **Learning**
2. **Reasoning**
3. **Problem-solving**
4. **Perception**

This classification is provisional. If the lecturer's confirmed notes use different areas - for example, machine learning, natural language processing, computer vision, and robotics, or learning, reasoning, knowledge representation, and planning - then the section headings, the terminology in the prototype, and the mapping table in Section 9 must be updated to match the official course material. The prototype was written so that the four areas are defined in a single file (`src/data/aiAreas.js`), with each entry holding its name, definition, implemented features, and honest limitations. Replacing the names in that one file updates the dashboard, the progress page, and the assistant disclosures without rewriting the application.

### 2.2 Definitions and relevance

**Learning.** Learning in AI refers to the ability of a system to improve its performance by acquiring knowledge from data or experience, for example by recognising patterns, classifying inputs, or predicting outcomes. Its relevance to this assignment is that a student also improves through accumulated evidence: what was studied, what was completed, and what was repeatedly missed. The prototype supports this by recording study sessions and assignment outcomes, calculating progress statistics over time, and generating recommendations from that recorded history.

**Reasoning.** Reasoning in AI refers to the process of drawing conclusions from known facts by applying rules and logic - deciding what follows from what. Its relevance is that a student must constantly decide what to do next under constraints such as deadlines, priorities, and limited time. The prototype demonstrates reasoning by comparing deadlines with the current date to detect overdue work, ranking pending assignments by urgency, and naming a single next action.

**Problem-solving.** Problem-solving in AI refers to finding a path from a current state to a desired goal, typically by decomposing the goal into sub-goals, considering possible actions, and choosing a workable plan. Its relevance is that phrases such as "pass the semester" or "finish my project" are goals, not plans. The prototype demonstrates problem-solving by breaking large goals into dated, timed study sessions, producing a suggested timetable when asked, and organising unfinished work into manageable next steps.

**Perception.** Perception in AI refers to an intelligent system's ability to interpret information coming from its environment - text, images, sound, or sensor readings - so that the input becomes usable meaning. Its relevance is that the agent cannot act on information it has not correctly understood: it must interpret typed dates, times, priorities, course codes, and free-text questions. The prototype demonstrates a limited form of perception by parsing and validating dates and times, reading priority selections and completion status as structured input, and analysing free-text questions through keyword matching to detect intent.

## 3. How I Plan to Study

My study plan is built around a fixed weekly rhythm that the four areas help me design and maintain.

**Learning.** I plan to study in short, scheduled blocks rather than long, irregular sessions, and I will record every session in the Study Planner. At the end of each week I will review the completion statistics: the topics I planned versus the topics I actually finished. This record shows me which subjects consistently lose time and which study patterns work. I will also re-read lecture notes within 24 hours of each lecture while the material is fresh, because spaced revisiting is more effective than a single long reading.

**Reasoning.** I plan to apply simple decision rules to my studying. If a topic appears in two consecutive weeks as unfinished, it becomes my highest study priority. If an examination date is close, weak topics are promoted above new topics. Inside the prototype, the same style of rule ranks overdue and soon-due work first, so my personal rules and the agent's rules stay consistent.

**Problem-solving.** Difficult topics are goals that feel too large, so I plan to decompose them. For example, "understand recursion" becomes: read the definition, trace three examples by hand, write one small program, then explain the concept aloud without notes. Each of these sub-steps can be scheduled as a separate 45-minute session in the planner, which converts an intimidating goal into a checklist I can complete.

**Perception.** I plan to be careful about how I capture information: correct dates on my planner entries, accurate course codes, and honest completion status. If the input is wrong, every conclusion drawn from it will also be wrong. In practical terms, this means entering examination and assignment dates as soon as they are announced, rather than relying on memory.

Monitoring my progress will therefore be continuous: schedule (problem-solving), execute (learning), judge what is urgent (reasoning), and keep the underlying information accurate (perception).

## 4. How I Plan to Do Assignments

I plan to treat every assignment as a small project with four stages: understanding, research, implementation, and checking.

**Understanding (perception and reasoning).** I will first read the question carefully and interpret exactly what is being asked: the task verb (describe, analyse, design, implement), the constraints, the word count, and the marking weight. This is a perception task - correctly extracting meaning from the written brief - followed by a reasoning task, in which I decide what the deliverable must contain. I have seen students lose marks by answering a question they assumed was being asked rather than the one that was set, so I will re-read the brief after my first draft.

**Research and planning (problem-solving).** I will break the assignment into steps: gather sources, outline, draft each section, produce figures or code, proofread, and submit. I will schedule these steps backwards from the deadline, starting the largest step first. The prototype supports this by letting me record each assignment with its deadline and priority and then ranking the pending list so the next task is always visible.

**Prioritisation and deadline management (reasoning).** When several assignments overlap, I will apply explicit rules: an overdue or same-day item always comes first; otherwise the nearest deadline wins; at equal deadlines, the higher-weighted or higher-priority task wins. These are the same rules implemented in the Assignment Tracker, so the agent's suggestion is never arbitrary.

**Implementation and checking (learning and reasoning).** During drafting I will work in timed blocks and record them as study sessions, which gives me an honest picture of how long writing actually takes. After completing a draft, I will check it against the brief point by point, verify calculations or code, check references, and confirm formatting. Finally, I will submit early where possible, because technical problems on the submission night are entirely predictable.

## 5. How I Plan to Pass CSM 395

My plan for passing CSM 395 combines consistent habits with deliberate use of the four areas.

**Consistent attendance and note review (learning).** I plan to attend every lecture and tutorial, then review and tidy my notes within a day of each lecture. Attendance alone is passive; the review step is what converts hearing into knowing.

**Practical exercises (learning and problem-solving).** CSM 395 is a practical course, so I plan to reproduce examples myself rather than only reading them. Whenever a concept is introduced, I will build a small variant of it independently. Writing code or solving problems from memory exposes gaps that re-reading never reveals.

**Independent research (perception and reasoning).** Where lecture material is thin, I plan to consult official documentation and recommended readings, evaluate whether a source is trustworthy, and reconcile conflicting explanations. This is perception (interpreting new material) plus reasoning (judging what is credible and applicable).

**Assignments (reasoning and problem-solving).** I will enter every CSM 395 deadline into the Assignment Tracker on the day it is announced and follow the prioritisation rules described in Section 4. Leaving deadlines only in my head is the most common cause of avoidable late submission.

**Revision (learning and problem-solving).** I plan to revise in small weekly blocks instead of cramming, using active recall and past questions, and to re-test difficult topics after two days and again after a week. My weakest topics - identified from my recorded study history - receive the earliest revision slots.

**Seeking clarification (perception and reasoning).** If a concept remains unclear after two attempts, I plan to ask the lecturer or a classmate early rather than carrying the confusion forward. Early clarification is much cheaper than discovering the gap during revision.

**Progress monitoring (learning).** At the end of each week I will review my completion statistics in the prototype and adjust the following week's plan. Improvement requires feedback, and the progress page provides that feedback in numbers.

## 6. Plan for Developing the CSM 395 AI Agent

### 6.1 Academic problem being addressed

University students commonly manage several courses at once, with assignments, examinations, and practical work competing for limited time. The information needed to manage this workload is usually scattered across lecture announcements, printed handouts, and memory. The result is missed deadlines, unplanned revision, and poor visibility of actual progress. The academic problem is therefore an **organisation and decision-support problem**: how can a student see their workload clearly, decide what to do next, and receive timely study advice?

### 6.2 Intended users

The primary user is an undergraduate student juggling multiple courses in a semester, who needs a simple place to schedule study, track deadlines, and review progress. A secondary user is the student preparing specifically for CSM 395 who wants structured guidance on how to approach the course and its project. The prototype deliberately excludes lecturer and administrator roles to keep the scope achievable.

### 6.3 Objectives of the project

1. Provide a single interface in which a student can schedule study sessions and record assignment deadlines.
2. Persist that information locally so it survives page refreshes without requiring an account or a server.
3. Calculate honest statistics from the recorded data rather than displaying fixed example values.
4. Offer basic study-planning advice through a transparent, rule-based assistant.
5. Demonstrate the four provisional areas of AI through features the student can actually use.
6. Keep the system usable, responsive, and understandable as an undergraduate prototype.

### 6.4 Functional requirements

| ID | Requirement |
|----|-------------|
| FR1 | The system shall display a dashboard with total, pending, and completed assignments, upcoming deadlines, today's sessions, completed sessions, and overall progress, all calculated from stored data. |
| FR2 | The system shall allow the student to add, view, complete, and delete study sessions, including subject, topic, date, start time, and duration. |
| FR3 | The system shall allow the student to add, view, complete, and delete assignments, including title, course code, deadline, and priority, and shall identify overdue items. |
| FR4 | The system shall validate all required fields and prevent incomplete submissions. |
| FR5 | The system shall provide a chat-style assistant that answers study-related questions using keyword matching, hand-written rules, and the student's own data. |
| FR6 | The system shall display progress statistics and progress bars that update whenever the data changes. |
| FR7 | The system shall store all data in the browser's localStorage and recover safely from missing or malformed values. |
| FR8 | The interface shall be responsive and navigable on desktop and mobile screens. |

### 6.5 Development approach

I followed an iterative, top-down approach:

1. **Analysis:** list the user's tasks and convert them into the functional requirements above.
2. **Data design:** define two records - an assignment and a study session - and decide that both are stored as arrays in localStorage.
3. **Shared logic:** implement date handling, statistics, and the assistant engine as separate modules so that every page uses identical calculations.
4. **Interface design:** build the layout and navigation first, then the dashboard, planner, tracker, assistant, and progress pages.
5. **Verification:** run a production build, fix any errors, and test forms, navigation, empty states, and persistence.

Testing is manual and scenario-based: I add sample data, verify that each statistic matches an independent count, trigger each validation message, mark items complete, delete items, and reload the page to confirm persistence. Future iterations could add automated component tests.

### 6.6 Technologies used

- **React 18** with **JavaScript (ES modules)** for the component structure and state management.
- **Vite 5** as the development server and production build tool.
- **HTML5 and CSS3** for structure and styling, including CSS Grid, Flexbox, and media queries for responsiveness.
- **Browser localStorage** for persistence - no database, server, account, or API key is required.
- No external AI service, paid API, or authentication system is used; the assistant is plain JavaScript.

### 6.7 Testing and improvement of the prototype

**Testing:** the prototype can be tested by running `npm run build` to confirm a clean production bundle, then `npm run dev` and checking each page: adding data on each form, verifying that blank submissions are rejected, confirming that dashboard and progress figures change when data changes, marking items complete and deleting them, reloading the browser to confirm persistence, asking the assistant each example question, and resizing the window to confirm mobile layout.

**Improvement:** priorities for the next iteration are (i) correcting the four areas to the lecturer's confirmed classification, (ii) adding a seeded demonstration dataset for demonstration purposes, (iii) exporting and importing data, (iv) recurring study sessions and reminders, and (v) optionally integrating a genuine language model behind a clearly disclosed interface. Each of these is a proposed improvement, not an implemented feature.

## 7. Prototype UI Description

The prototype opens on a **dashboard** with a fixed sidebar navigation. The colour scheme is blue, white, and violet.

**Dashboard.** The dashboard greets the student and presents a grid of statistic cards: total assignments, pending, completed, overdue, sessions today, total sessions, completed sessions, and overall activity progress. Below these sit an overall progress bar, a panel of deadlines within the next seven days, a panel of today's study sessions, a list of next actions, and a summary of the four areas of AI. Two quick-action buttons jump directly to the planner and the tracker. When no data exists, an empty state explains what to do first instead of showing meaningless zeros.

**Study Planner.** The planner provides a form for subject/course code, topic, date, start time, and duration, with inline validation for every required field and a sensible duration range. Saved sessions appear in a filterable list (all, today, upcoming, completed) with colour-coded status labels distinguishing completed, today, missed, and upcoming sessions. Each row offers "mark completed" and "delete" buttons, and an overview panel summarises totals.

**Assignment Tracker.** The tracker form captures title, course code, deadline, and priority, rejecting empty submissions and deadlines in the past. Assignments are listed under pending, overdue, and completed tabs, sorted by deadline and then priority. Each row shows the course, a priority tag, the deadline, and a badge such as "due today", "due in 2 days", or "overdue by 3 days", with overdue rows highlighted in red.

**AI Study Assistant.** The assistant uses a chat layout with message bubbles, an input field, a send button, a clear-chat button, and ten clickable example questions. Answers are returned as structured text covering timetables, examination preparation, revision, prioritisation, time management, procrastination, CSM 395 preparation, project planning, and progress summaries. When the question concerns the student's own work, the reply is generated from the actual saved assignments and sessions. A visible disclosure states that the assistant is rule-based and is not a large language model.

**Progress and Reports.** This page shows eight summary cards (total, completed, pending, overdue assignments; total and completed sessions; session and assignment completion rates), three donut charts with matching progress bars, a rule-generated recommendation list, a priority queue showing the next assignments to tackle, and a panel mapping each of the four areas to its honest implementation status. All figures are derived from stored data, and the page states explicitly that no grades or examination results are recorded.

## 8. Application of the Four Areas of AI in the Agent

| Area | Implemented feature in the prototype | Status |
|------|--------------------------------------|--------|
| **Learning** | Completed sessions and assignments are recorded; completion rates and overall progress are calculated; recommendations are generated from the recorded history. | Implemented as progress tracking and simple data analysis. |
| **Reasoning** | Overdue detection by date comparison; ranking of assignments by deadline, then priority; the "next action" suggestion; deadline-aware advice from the assistant. | Implemented as hand-written if/else rules. |
| **Problem-solving** | Goal decomposition into dated, timed sessions; suggested study timetable; prioritised queue of unfinished work; separation of today's, upcoming, and completed tasks. | Implemented with fixed templates and scheduling rules. |
| **Perception** | Parsing and validating dates, times, durations, and priority choices; reading completion status; keyword-based intent detection on free-text questions; input error reporting. | Implemented as text/data interpretation only. |

**Honest distinction between implemented and proposed.** The features above are implemented and can be demonstrated in the running application. What is *not* implemented includes machine-learning model training, natural-language understanding beyond keyword matching, computer vision, speech recognition, sensor processing, automated timetable optimisation, and any connection to an external AI service. Tracking progress is learning-related support, not machine learning. Describing the assistant as "rule-based" is accurate; describing it as an intelligent tutor with deep understanding would not be.

## 9. Limitations and Future Improvements

**Limitations.**

1. The assistant is rule-based. It recognises a fixed set of keyword topics and returns prepared responses; it cannot hold a genuine open-domain conversation or explain novel concepts.
2. The classification of the four areas is provisional and must be corrected against the lecturer's notes.
3. Data lives in one browser's localStorage: it is not synchronised across devices and can be cleared by the user or by private browsing. There is no export or backup facility yet.
4. The statistics describe activity only. No grades, marks, or examination results exist anywhere in the system.
5. There is no authentication, so the application is a single-user local tool.
6. Suggested timetables follow a fixed template rather than optimising for the student's free periods.
7. Testing is manual; no automated test suite is included.

**Future improvements.**

1. Replace the provisional AI-area names with the confirmed course classification.
2. Add a seeded demonstration dataset so reviewers can see populated screens immediately.
3. Add JSON export and import for backup and device transfer.
4. Add recurring sessions, examination dates, and local reminders.
5. Introduce spaced-repetition revision scheduling based on recorded history.
6. Optionally connect a real language model behind an interface that honestly discloses the change, keeping rule-based fallback behaviour.
7. Add automated tests for the statistics and assistant modules.

## 10. Conclusion

The four areas of AI - used here as a clearly labelled provisional framework of learning, reasoning, problem-solving, and perception - give me a practical structure for planning the semester. Learning describes how I build knowledge from reviewed material and recorded activity; reasoning describes how I decide what is urgent and what to do next; problem-solving describes how I break large goals into schedulable steps; and perception describes the need to capture dates, times, and questions correctly. The same four areas apply directly to my study routine, my assignment strategy, my plan for passing CSM 395, and my approach to the agent project.

The Student Study Assistant Agent turns that plan into a working prototype: a responsive React application with a dashboard, study planner, assignment tracker, rule-based assistant, and progress reports, all persisting data in the browser and calculating every figure from real user input. It demonstrates each of the four areas through usable features while being explicit about what it does not do. Correcting the classification against the lecturer's notes, and improving the assistant's depth, are the natural next steps.

## 11. References

No reference materials - lecture notes, slides, prescribed textbooks, or recommended readings - were available in this workspace, so no citations are given here rather than risk fabricating sources. This section must be completed using the lecturer's recommended materials and the CSM 395 course outline before submission, for example the prescribed textbook and the course notes covering the four areas of AI.
