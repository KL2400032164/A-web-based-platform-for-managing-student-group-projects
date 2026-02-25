import { useMemo } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import { projects } from '../data/dummyData';

const StudentProjects = () => {
  const studentProjects = useMemo(
    () => projects.filter((project) => project.assignedStudents.includes('s1')),
    []
  );

  return (
    <div className="dashboard-shell">
      <Sidebar role="student" />
      <main className="dashboard-main">
        <Navbar title="My Projects" />
        <section>
          <h2 className="section-heading">Assigned Projects</h2>
          <div className="project-grid">
            {studentProjects.map((project) => (
              <ProjectCard key={project.id} project={project} role="student" />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentProjects;
