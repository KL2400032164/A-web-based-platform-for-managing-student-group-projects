const statuses = ['Pending', 'In Progress', 'Completed'];

const TaskCard = ({ task, onStatusChange, readOnly = false }) => {
  return (
    <article className="task-card">
      <div>
        <h4>{task.title}</h4>
        <span className={`status-badge status-${task.status.toLowerCase().replace(/\s+/g, '-')}`}>
          {task.status}
        </span>
      </div>

      {!readOnly && (
        <select value={task.status} onChange={(event) => onStatusChange(task.id, event.target.value)}>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      )}
    </article>
  );
};

export default TaskCard;
