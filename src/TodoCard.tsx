import { useEffect, useState } from "react";

type Status = "Pending" | "In Progress" | "Done";
// type Priority = "Low" | "Medium" | "High";
const Priority = ["Low", "Medium", "High"];

const DUE_DATE = new Date("2026-04-16T18:00:00Z");

function getTimeRemainingText(dueDate: Date) {
  const now = new Date();
  const diff = dueDate.getTime() - now.getTime();

  const absDiff = Math.abs(diff);

  const minutes = Math.floor(absDiff / (1000 * 60));
  const hours = Math.floor(absDiff / (1000 * 60 * 60));
  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));

  if (Math.abs(diff) < 60000) return "Due now!";

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

export default function TodoCard() {
  const [completed, setCompleted] = useState(false);
  const [status, setStatus] = useState<Status>("Pending");
  const [timeRemaining, setTimeRemaining] = useState(
    getTimeRemainingText(DUE_DATE),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemainingText(DUE_DATE));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleToggle = () => {
    const newValue = !completed;
    setCompleted(newValue);
    setStatus(newValue ? "Done" : "Pending");
  };

  return (
    <article
      data-testid="test-todo-card"
      className="max-w-md w-full mx-auto p-4 rounded-2xl shadow-md border bg-white flex flex-col gap-3"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h2
          data-testid="test-todo-title"
          className={`text-lg font-semibold ${
            completed ? "line-through text-gray-400" : ""
          }`}
        >
          Build Todo Card UI
        </h2>

        <span
          data-testid="test-todo-priority"
          aria-label="Priority: High"
          className={`text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 font-medium`}
        >
          {Priority[2]}
        </span>
      </div>

      {/* Description */}
      <p data-testid="test-todo-description" className="text-sm text-gray-600">
        Create a single page, responsive and accessible todo card component with proper test
        IDs and time tracking.
      </p>

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
      <div className="flex flex-col text-sm text-gray-700 gap-1">
        <time
          data-testid="test-todo-due-date"
          dateTime={DUE_DATE.toISOString()}
        >
          Due{" "}
          {DUE_DATE.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </time>

        <time data-testid="test-todo-time-remaining" aria-live="polite">
          {timeRemaining}
        </time>
      </div>

      {/* Status */}
      <span
        data-testid="test-todo-status"
        aria-label={`Status: ${status}`}
        className="text-sm font-medium"
      >
        {status}
      </span>

      {/* Actions */}
      <div className="flex items-center justify-between mt-2">
        {/* Checkbox */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            data-testid="test-todo-complete-toggle"
            checked={completed}
            onChange={handleToggle}
            className="w-4 h-4"
          />
          <span>Mark as complete</span>
        </label>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            data-testid="test-todo-edit-button"
            onClick={() => console.log("edit clicked")}
            className="text-sm px-3 py-1 rounded-lg border hover:bg-gray-100 focus:outline-2"
          >
            Edit
          </button>

          <button
            data-testid="test-todo-delete-button"
            onClick={() => alert("Delete clicked")}
            className="text-sm px-3 py-1 rounded-lg border text-red-600 hover:bg-red-50 focus:outline-2"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
