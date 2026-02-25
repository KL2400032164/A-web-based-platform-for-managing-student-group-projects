import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MilestoneTracker from '../components/MilestoneTracker';
import TaskCard from '../components/TaskCard';
import { projects, students } from '../data/dummyData';

const ProjectDetails = () => {
  const { id } = useParams();
  const project = projects.find((item) => item.id === id);

  if (!project) {
    return (
      <div className="simple-page">
        <h2>Project not found</h2>
        <Link to="/student" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const assignedMembers = students.filter((student) => project.assignedStudents.includes(student.id));

  return (
    <div className="dashboard-main full-width-page">
      <Navbar title="Project Details" />

      <section className="card">
        <h2>{project.title}</h2>
        <p>{project.description}</p>
        <p>
          <strong>Deadline:</strong> {project.deadline}
        </p>

        <div className="members-row">
          {assignedMembers.map((member) => (
            <span key={member.id} className="member-tag">
              {member.name}
            </span>
          ))}
        </div>
      </section>

      <section className="card">
        <h3>Task List</h3>
        <div className="task-list">
          {project.tasks.map((task) => (
            <TaskCard key={task.id} task={task} readOnly />
          ))}
        </div>
      </section>

      <MilestoneTracker milestones={project.milestones} />

      <section className="submit-cta">
        <Link to="/submit" className="btn btn-primary">
          Submit Final Work
        </Link>
      </section>
    </div>
  );
};

export default ProjectDetails;
