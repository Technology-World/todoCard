# TodoCard Component

A responsive, accessible React todo card component with live countdown, inline editing, priority indicators, status controls, and expand/collapse behavior.

---

## Stages

- **Stage 0** — Static card with completion toggle, priority badge, due date countdown, and tags
- **Stage 1** *(current)* — Interactive card with edit mode, status control, overdue detection, and collapsible description

---

## Features

### Stage 0
- ✅ Toggle completion state (Pending → Done)
- ⏱ Live due date countdown
- 🏷 Priority badge (Low / Medium / High)
- 🔖 Tag list with ARIA roles
- ♿ Accessible markup — `aria-label`, `aria-live`, semantic `<time>` elements
- 🧪 Full `data-testid` coverage

### Stage 1 (New)
- ✏️ Inline edit mode — title, description, priority, and due date
- 🔄 Status control dropdown — Pending / In Progress / Done (synced with checkbox)
- 🎨 Priority indicator — colored left border + accent bar + dot badge
- 📐 Expand / collapse for long descriptions (keyboard accessible)
- 🚨 Overdue indicator — red badge + red date text when past due
- ⏹ Timer freezes and shows "Completed" when status is Done
- ⏱ Countdown now updates every **30 seconds**

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
├── Overdue indicator       → Pulsing red badge (conditional)
├── Edit form               → Title · Description · Priority · Due date (edit mode only)
│   └── Save / Cancel
├── Header                  → Title + Priority badge
├── Description             → Collapsible if > 100 chars
├── Tags                    → work · urgent · design
├── Dates                   → Due date + live time remaining
├── Status badge            → Pending / In Progress / Done
└── Actions bar
    ├── Complete toggle     → Checkbox synced with status
    ├── Status control      → Dropdown (Pending / In Progress / Done)
    ├── Edit button         → Opens edit form
    └── Delete button
```

---

## Data Test IDs

### Stage 0 (preserved)

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
| Status display | `test-todo-status` |
| Complete toggle | `test-todo-complete-toggle` |
| Edit button | `test-todo-edit-button` |
| Delete button | `test-todo-delete-button` |

### Stage 1 (new)

| Element | `data-testid` |
|---|---|
| Edit form container | `test-todo-edit-form` |
| Title input | `test-todo-edit-title-input` |
| Description textarea | `test-todo-edit-description-input` |
| Priority select | `test-todo-edit-priority-select` |
| Due date input | `test-todo-edit-due-date-input` |
| Save button | `test-todo-save-button` |
| Cancel button | `test-todo-cancel-button` |
| Status control | `test-todo-status-control` |
| Priority indicator | `test-todo-priority-indicator` |
| Expand/collapse toggle | `test-todo-expand-toggle` |
| Collapsible section | `test-todo-collapsible-section` |
| Overdue indicator | `test-todo-overdue-indicator` |

---

## Behavior Reference

### Edit Mode
- Clicking Edit opens the inline form with current values pre-filled
- Save applies changes; Cancel restores previous values
- Escape key also cancels
- Focus moves to the first form field on open, returns to Edit button on close

### Status & Checkbox Sync
- Checking the checkbox → status becomes **Done**
- Setting status dropdown to **Done** → checkbox becomes checked
- Unchecking after Done → reverts to **Pending**

### Time Remaining Logic

| Condition | Output |
|---|---|
| Status is Done | `Completed` |
| < 1 minute | `Due now!` |
| Future — days | `Due in X days` / `Due tomorrow` |
| Future — hours | `Due in X hours` |
| Future — minutes | `Due in X minutes` |
| Past — days | `Overdue by X days` |
| Past — hours | `Overdue by X hours` |
| Past — minutes | `Overdue by X minutes` |

Interval refreshes every **30 seconds** and cleans up on unmount.

### Expand / Collapse
- Descriptions over **100 characters** collapse by default
- "Show more" / "Show less" toggle with `aria-expanded` and `aria-controls`

---

## Accessibility

- `aria-label` on priority badge, status display, and status control
- `aria-live="polite"` on time remaining
- `aria-expanded` + `aria-controls` on expand toggle
- `role="alert"` on overdue indicator
- All edit form fields have associated `<label for="">`
- `sr-only` label on status control
- Semantic elements: `<article>`, `<time>`, `<label>`
- `role="list"` / `role="listitem"` on tag container
- Focus management: Edit → form field on open; Edit button on close

### Keyboard Tab Order
`Checkbox → Status control → Expand toggle → Edit → Delete`  
In edit mode: `Title → Description → Priority → Due date → Save → Cancel`

---

## Known Limitations

- Tags are currently hardcoded (not editable)
- Delete button shows a browser `alert()` — no real handler yet
- No prop interface yet — all initial values are set inside the component
- No unit tests written yet

---

## Planned Improvements

- [ ] Accept props (title, description, priority, tags, dueDate, onDelete, onSave)
- [ ] Editable tags in edit mode
- [ ] Wire up real Delete handler
- [ ] Write unit tests (Jest + React Testing Library)
- [ ] Animate edit form open/close