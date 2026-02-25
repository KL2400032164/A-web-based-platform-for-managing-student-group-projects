import { Link } from 'react-router-dom';
import { getProjectProgress, students } from '../data/dummyData';

const SUBMISSION_STATUS_KEY = 'spms_student_submission_done';

const ProjectCard = ({ project, role = 'student' }) => {
  const hasSubmittedWork = localStorage.getItem(SUBMISSION_STATUS_KEY) === 'true';
  const progress = role === 'student' ? (hasSubmittedWork ? 50 : 0) : getProjectProgress(project);
  const assignedMembers = students.filter((student) => project.assignedStudents.includes(student.id));

  return (
    <article className="card project-card">
      <div className="card-head">
        <h3>{project.title}</h3>
        <span className="deadline-pill">Due: {project.deadline}</span>
      </div>
      <p>{project.description}</p>

      <div className="members-row">
        {assignedMembers.map((member) => (
          <span className="member-tag" key={member.id}>
            {member.name}
          </span>
        ))}
      </div>

      <div className="progress-section">
        <div className="progress-meta">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="card-actions">
        <Link to={`/project/${project.id}`} className="btn btn-secondary">
          View Details
        </Link>
        {role === 'student' && (
          <Link to="/submit" className="btn btn-primary">
            Submit Work
          </Link>
        )}
      </div>
    </article>
  );
};

export default ProjectCard;
