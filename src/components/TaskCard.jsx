import { useState } from 'react';

const statuses = ['Pending', 'In Progress', 'Completed'];

const TaskCard = ({ task, onStatusChange, onEditTask, onDeleteTask, readOnly = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  const handleSave = () => {
    if (!title.trim()) return;
    onEditTask?.(task.id, title.trim());
    setIsEditing(false);
  };

  return (
    <article className="task-card">
      <div>
        {isEditing ? (
          <div className="task-edit-row">
            <input value={title} onChange={(event) => setTitle(event.target.value)} />
            <button type="button" className="btn btn-secondary" onClick={handleSave}>
              Save
            </button>
          </div>
        ) : (
          <h4>{task.title}</h4>
        )}
        <span className={`status-badge status-${task.status.toLowerCase().replace(/\s+/g, '-')}`}>
          {task.status}
        </span>
      </div>

      {!readOnly && (
        <div className="task-controls">
          <select value={task.status} onChange={(event) => onStatusChange(task.id, event.target.value)}>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <div className="task-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setIsEditing((prev) => !prev)}>
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => onDeleteTask?.(task.id)}>
              Delete
            </button>
          </div>
        </div>
      )}
    </article>
  );
};

export default TaskCard;
