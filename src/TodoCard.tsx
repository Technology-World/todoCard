import { useEffect, useRef, useState } from "react";

type Status = "Pending" | "In Progress" | "Done";
type Priority = "Low" | "Medium" | "High";

const PRIORITIES: Priority[] = ["Low", "Medium", "High"];
const STATUSES: Status[] = ["Pending", "In Progress", "Done"];
const DESCRIPTION_COLLAPSE_LENGTH = 100;

const INITIAL_DUE_DATE = new Date("2026-04-17T23:59:00Z");

function getTimeRemainingText(dueDate: Date, isDone: boolean): string {
  if (isDone) return "Completed";

  const now = new Date();
  const diff = dueDate.getTime() - now.getTime();
  const absDiff = Math.abs(diff);

  const minutes = Math.floor(absDiff / (1000 * 60));
  const hours = Math.floor(absDiff / (1000 * 60 * 60));
  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));

  if (absDiff < 60000) return "Due now!";

  if (diff > 0) {
    if (days > 0) return days === 1 ? "Due tomorrow" : `Due in ${days} days`;
    if (hours > 0) return `Due in ${hours} hours`;
    return `Due in ${minutes} minutes`;
  } else {
    if (days > 0) return `Overdue by ${days} days`;
    if (hours > 0) return `Overdue by ${hours} hours`;
    return `Overdue by ${minutes} minutes`;
  }
}

function isOverdue(dueDate: Date, isDone: boolean): boolean {
  return !isDone && dueDate.getTime() < Date.now();
}

const priorityConfig: Record<
  Priority,
  { label: string; dot: string; badge: string; border: string }
> = {
  Low: {
    label: "Low",
    dot: "bg-emerald-400",
    badge: "bg-emerald-50 text-emerald-700",
    border: "border-l-emerald-400",
  },
  Medium: {
    label: "Medium",
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700",
    border: "border-l-amber-400",
  },
  High: {
    label: "High",
    dot: "bg-red-500",
    badge: "bg-red-50 text-red-700",
    border: "border-l-red-500",
  },
};

const statusConfig: Record<Status, { color: string; bg: string }> = {
  Pending: { color: "text-gray-500", bg: "bg-gray-100" },
  "In Progress": { color: "text-blue-600", bg: "bg-blue-50" },
  Done: { color: "text-emerald-600", bg: "bg-emerald-50" },
};

export default function TodoCard() {
  // Core state
  const [title, setTitle] = useState("Build Todo Card UI");
  const [description, setDescription] = useState(
    "Create a single page, responsive and accessible todo card component with proper test IDs and time tracking.",
  );
  const [priority, setPriority] = useState<Priority>("High");
  const [status, setStatus] = useState<Status>("Pending");
  const [completed, setCompleted] = useState(false);
  const [dueDate, setDueDate] = useState<Date>(INITIAL_DUE_DATE);

  // UI state
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Edit form draft state
  const [draftTitle, setDraftTitle] = useState(title);
  const [draftDescription, setDraftDescription] = useState(description);
  const [draftPriority, setDraftPriority] = useState<Priority>(priority);
  const [draftDueDate, setDraftDueDate] = useState(
    INITIAL_DUE_DATE.toISOString().slice(0, 16),
  );

  const editButtonRef = useRef<HTMLButtonElement>(null);
  const firstFormFieldRef = useRef<HTMLInputElement>(null);

  const isDone = status === "Done";
  const overdue = isOverdue(dueDate, isDone);
  const isLongDescription = description.length > DESCRIPTION_COLLAPSE_LENGTH;
  const pConfig = priorityConfig[priority];
  const sConfig = statusConfig[status];

  // Timer effect — stops when Done
  useEffect(() => {
    if (isDone) return;
    const interval = setInterval(() => {
      // Trigger re-render to update timeRemaining
    }, 30000);
    return () => clearInterval(interval);
  }, [isDone]);

  const timeRemaining = getTimeRemainingText(dueDate, isDone);
  // Sync checkbox ↔ status
  const handleToggle = () => {
    const newCompleted = !completed;
    setCompleted(newCompleted);
    setStatus(newCompleted ? "Done" : "Pending");
  };

  const handleStatusChange = (newStatus: Status) => {
    setStatus(newStatus);
    setCompleted(newStatus === "Done");
  };

  // Edit mode handlers
  const openEdit = () => {
    setDraftTitle(title);
    setDraftDescription(description);
    setDraftPriority(priority);
    setDraftDueDate(dueDate.toISOString().slice(0, 16));
    setIsEditing(true);
    setTimeout(() => firstFormFieldRef.current?.focus(), 50);
  };

  const handleSave = () => {
    setTitle(draftTitle.trim() || title);
    setDescription(draftDescription.trim() || description);
    setPriority(draftPriority);
    setDueDate(new Date(draftDueDate));
    setIsEditing(false);
    setTimeout(() => editButtonRef.current?.focus(), 50);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTimeout(() => editButtonRef.current?.focus(), 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") handleCancel();
  };

  const displayedDescription =
    isLongDescription && !isExpanded
      ? description.slice(0, DESCRIPTION_COLLAPSE_LENGTH) + "…"
      : description;

  return (
    <article
      data-testid="test-todo-card"
      className={`
        max-w-md w-full mx-auto rounded-2xl shadow-md border-l-4 bg-white
        flex flex-col gap-3 overflow-hidden transition-all duration-300
        ${pConfig.border}
        ${isDone ? "opacity-75" : ""}
        ${overdue ? "ring-1 ring-red-200" : ""}
      `}
    >
      {/* Priority indicator bar */}
      <div
        data-testid="test-todo-priority-indicator"
        className={`h-1 w-full ${pConfig.dot} opacity-60`}
      />

      <div className="px-4 pb-4 flex flex-col gap-3">
        {/* Overdue indicator */}
        {overdue && (
          <div
            data-testid="test-todo-overdue-indicator"
            className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-md w-fit"
            role="alert"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-pulse" />
            Overdue
          </div>
        )}

        {/* Edit Form */}
        {isEditing ? (
          <div
            data-testid="test-todo-edit-form"
            className="flex flex-col gap-3"
            onKeyDown={handleKeyDown}
            role="group"
            aria-label="Edit task"
          >
            <div className="flex flex-col gap-1">
              <label
                htmlFor="edit-title"
                className="text-xs font-medium text-gray-600"
              >
                Title
              </label>
              <input
                id="edit-title"
                ref={firstFormFieldRef}
                type="text"
                data-testid="test-todo-edit-title-input"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                className="text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="edit-description"
                className="text-xs font-medium text-gray-600"
              >
                Description
              </label>
              <textarea
                id="edit-description"
                data-testid="test-todo-edit-description-input"
                value={draftDescription}
                onChange={(e) => setDraftDescription(e.target.value)}
                rows={3}
                className="text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex flex-col gap-1 flex-1">
                <label
                  htmlFor="edit-priority"
                  className="text-xs font-medium text-gray-600"
                >
                  Priority
                </label>
                <select
                  id="edit-priority"
                  data-testid="test-todo-edit-priority-select"
                  value={draftPriority}
                  onChange={(e) => setDraftPriority(e.target.value as Priority)}
                  className="text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full bg-white"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1 flex-1">
                <label
                  htmlFor="edit-due-date"
                  className="text-xs font-medium text-gray-600"
                >
                  Due date
                </label>
                <input
                  id="edit-due-date"
                  type="datetime-local"
                  data-testid="test-todo-edit-due-date-input"
                  value={draftDueDate}
                  onChange={(e) => setDraftDueDate(e.target.value)}
                  className="text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                data-testid="test-todo-save-button"
                onClick={handleSave}
                className="flex-1 text-sm px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium transition-colors"
              >
                Save
              </button>
              <button
                data-testid="test-todo-cancel-button"
                onClick={handleCancel}
                className="flex-1 text-sm px-3 py-2 rounded-lg border hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <h2
                data-testid="test-todo-title"
                className={`text-lg font-semibold leading-snug transition-colors ${
                  isDone ? "line-through text-gray-400" : "text-gray-800"
                }`}
              >
                {title}
              </h2>

              <span
                data-testid="test-todo-priority"
                aria-label={`Priority: ${priority}`}
                className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${pConfig.badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${pConfig.dot}`} />
                {priority}
              </span>
            </div>

            {/* Description + expand/collapse */}
            <div
              data-testid="test-todo-collapsible-section"
              id="todo-collapsible"
            >
              <p
                data-testid="test-todo-description"
                className={`text-sm transition-colors ${isDone ? "text-gray-400" : "text-gray-600"}`}
              >
                {displayedDescription}
              </p>

              {isLongDescription && (
                <button
                  data-testid="test-todo-expand-toggle"
                  onClick={() => setIsExpanded(!isExpanded)}
                  aria-expanded={isExpanded}
                  aria-controls="todo-collapsible"
                  className="text-xs text-blue-500 hover:text-blue-700 mt-1 focus:outline-none focus:underline"
                >
                  {isExpanded ? "Show less" : "Show more"}
                </button>
              )}
            </div>

            {/* Tags */}
            <div
              data-testid="test-todo-tags"
              role="list"
              className="flex flex-wrap gap-2"
            >
              <span
                role="listitem"
                data-testid="test-todo-tag-work"
                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
              >
                work
              </span>
              <span
                role="listitem"
                data-testid="test-todo-tag-urgent"
                className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full"
              >
                urgent
              </span>
              <span
                role="listitem"
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
              >
                design
              </span>
            </div>

            {/* Dates */}
            <div className="flex flex-col text-sm gap-1">
              <time
                data-testid="test-todo-due-date"
                dateTime={dueDate.toISOString()}
                className={
                  overdue ? "text-red-500 font-medium" : "text-gray-600"
                }
              >
                Due{" "}
                {dueDate.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>

              <time
                data-testid="test-todo-time-remaining"
                aria-live="polite"
                className={`text-xs font-medium ${
                  isDone
                    ? "text-emerald-600"
                    : overdue
                      ? "text-red-500"
                      : "text-gray-500"
                }`}
              >
                {timeRemaining}
              </time>
            </div>

            {/* Status display */}
            <span
              data-testid="test-todo-status"
              aria-label={`Status: ${status}`}
              className={`text-xs font-semibold px-2 py-1 rounded-full w-fit ${sConfig.bg} ${sConfig.color}`}
            >
              {status}
            </span>
          </>
        )}

        {/* Status control + actions — always visible */}
        {!isEditing && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-gray-100">
            {/* Left: checkbox + status control */}
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  data-testid="test-todo-complete-toggle"
                  checked={completed}
                  onChange={handleToggle}
                  className="w-4 h-4 accent-blue-600"
                />
                <span
                  className={
                    isDone ? "text-gray-400 line-through" : "text-gray-700"
                  }
                >
                  Mark as complete
                </span>
              </label>

              <div className="flex items-center gap-1.5">
                <label htmlFor="status-control" className="sr-only">
                  Task status
                </label>
                <select
                  id="status-control"
                  data-testid="test-todo-status-control"
                  value={status}
                  onChange={(e) => handleStatusChange(e.target.value as Status)}
                  aria-label="Change task status"
                  className={`text-xs border rounded-lg px-2 py-1 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white cursor-pointer ${sConfig.color}`}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right: Edit + Delete */}
            <div className="flex gap-2">
              <button
                ref={editButtonRef}
                data-testid="test-todo-edit-button"
                onClick={openEdit}
                className="text-sm px-3 py-1.5 rounded-lg border hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
              >
                Edit
              </button>

              <button
                data-testid="test-todo-delete-button"
                onClick={() => alert("Delete clicked")}
                className="text-sm px-3 py-1.5 rounded-lg border text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
