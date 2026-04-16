# TodoCard Component

A responsive, accessible React todo card component with live countdown, priority badges, and status tracking.

---

## Features

- ✅ Toggle completion state (Pending → Done)
- ⏱ Live due date countdown — updates every minute
- 🏷 Priority badge (Low / Medium / High)
- 🔖 Tag list with ARIA roles
- ♿ Accessible markup — `aria-label`, `aria-live`, semantic `<time>` elements
- 🧪 Full `data-testid` coverage for testing

---

## Tech Stack

- React (with Hooks)
- TypeScript
- Tailwind CSS

---

## Usage

```tsx
import TodoCard from "./TodoCard";

function App() {
  return <TodoCard />;
}
```

---

## Component Structure

```
TodoCard
├── Header        → Title + Priority badge
├── Description   → Task description
├── Tags          → work · urgent · design
├── Dates         → Due date + live time remaining
├── Status        → Pending / In Progress / Done
└── Actions       → Complete toggle · Edit · Delete buttons
```

---

## Data Test IDs

| Element | `data-testid` |
|---|---|
| Card wrapper | `test-todo-card` |
| Title | `test-todo-title` |
| Priority badge | `test-todo-priority` |
| Description | `test-todo-description` |
| Tags container | `test-todo-tags` |
| Tag: work | `test-todo-tag-work` |
| Tag: urgent | `test-todo-tag-urgent` |
| Due date | `test-todo-due-date` |
| Time remaining | `test-todo-time-remaining` |
| Status | `test-todo-status` |
| Complete toggle | `test-todo-complete-toggle` |
| Edit button | `test-todo-edit-button` |
| Delete button | `test-todo-delete-button` |

---

## Time Remaining Logic

The `getTimeRemainingText` utility calculates the human-readable countdown:

| Condition | Output |
|---|---|
| < 1 minute | `Due now!` |
| Future — days | `Due in X days` / `Due tomorrow` |
| Future — hours | `Due in X hours` |
| Future — minutes | `Due in X minutes` |
| Past — days | `Overdue by X days` |
| Past — hours | `Overdue by X hours` |
| Past — minutes | `Overdue by X minutes` |

The interval refreshes every **60 seconds** and cleans up on unmount.

---

## Accessibility

- `aria-label` on priority badge and status span
- `aria-live="polite"` on the time remaining element
- Semantic `<article>`, `<time>`, and `<label>` elements
- `role="list"` / `role="listitem"` on tag container

---

## Planned Improvements

- [ ] Accept props (title, description, priority, tags, dueDate)
- [ ] Wire up Edit and Delete handlers
- [ ] Add "In Progress" status transition
- [ ] Write unit tests (Jest + React Testing Library)
