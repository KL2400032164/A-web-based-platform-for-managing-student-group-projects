import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MilestoneTracker from '../components/MilestoneTracker';
import TaskCard from '../components/TaskCard';
import { projectApi } from '../lib/api';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProject = async () => {
      try {
        const { project: projectDetails } = await projectApi.getById(id);
        setProject(projectDetails);
        setError('');
      } catch (requestError) {
        setError(requestError.message);
      }
    };

    loadProject();
  }, [id]);

  if (error || !project) {
    return (
      <div className="simple-page">
        <h2>{error || 'Project not found'}</h2>
        <Link to="/student" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    );
  }

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
          {project.assignedStudentDetails.map((member) => (
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
        <Link to={`/submit?projectId=${project.id}`} className="btn btn-primary">
          Submit Final Work
        </Link>
      </section>
    </div>
  );
};

export default ProjectDetails;

