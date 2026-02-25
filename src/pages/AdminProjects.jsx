import { useMemo } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import { projects } from '../data/dummyData';

const AdminProjects = () => {
  const projectList = useMemo(() => projects, []);

  return (
    <div className="dashboard-shell">
      <Sidebar role="admin" />
      <main className="dashboard-main">
        <Navbar title="Admin Projects" />
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
