import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import { useAuth } from '../context/AuthContext';
import { projectApi } from '../lib/api';

const AdminProjects = () => {
  const { user } = useAuth();
  const [projectList, setProjectList] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const { projects } = await projectApi.list(user);
        setProjectList(projects);
        setError('');
      } catch (requestError) {
        setError(requestError.message);
      }
    };

    loadProjects();
  }, [user]);

  return (
    <div className="dashboard-shell">
      <Sidebar role="admin" />
      <main className="dashboard-main">
        <Navbar title="Admin Projects" />
        {error && <p className="error-text">{error}</p>}
        <section>
          <h2 className="section-heading">All Projects</h2>
          <div className="project-grid">
            {projectList.map((project) => (
              <ProjectCard key={project.id} project={project} role="admin" />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminProjects;

