import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import { useAuth } from '../context/AuthContext';
import { projectApi } from '../lib/api';

const StudentProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const { projects: projectList } = await projectApi.list(user);
        setProjects(projectList);
        setError('');
      } catch (requestError) {
        setError(requestError.message);
      }
    };

    loadProjects();
  }, [user]);

  return (
    <div className="dashboard-shell">
      <Sidebar role="student" />
      <main className="dashboard-main">
        <Navbar title="My Projects" />
        {error && <p className="error-text">{error}</p>}
        <section>
          <h2 className="section-heading">Assigned Projects</h2>
          <div className="project-grid">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} role="student" />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentProjects;

