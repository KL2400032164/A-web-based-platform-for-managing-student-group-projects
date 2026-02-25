import { useMemo } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { projects } from '../data/dummyData';

const AdminSubmissions = () => {
  const submittedProjects = useMemo(
    () => projects.filter((project) => project.finalSubmissions.length > 0),
    []
  );

  return (
    <div className="dashboard-shell">
      <Sidebar role="admin" />
      <main className="dashboard-main">
        <Navbar title="Final Submissions" />
        <section className="card">
          <h3>Submitted Work</h3>
          <div className="submission-list">
            {submittedProjects.map((project) => (
              <article key={project.id} className="submission-item">
                <h4>{project.title}</h4>
                {project.finalSubmissions.map((submission, index) => (
                  <p key={`${project.id}-${index}`}>
                    {submission.studentId}: {submission.comment}
                  </p>
                ))}
              </article>
            ))}
            {!submittedProjects.length && <p className="empty-text">No submissions yet.</p>}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminSubmissions;
