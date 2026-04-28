import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { projectApi } from '../lib/api';

const AdminSubmissions = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');

  const submittedProjects = useMemo(
    () => projects.filter((project) => project.finalSubmissions.length > 0),
    [projects]
  );

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
      <Sidebar role="admin" />
      <main className="dashboard-main">
        <Navbar title="Final Submissions" />
        {error && <p className="error-text">{error}</p>}
        <section className="card">
          <h3>Submitted Work</h3>
          <div className="submission-list">
            {submittedProjects.map((project) => (
              <article key={project.id} className="submission-item">
                <h4>{project.title}</h4>
                {project.finalSubmissions.map((submission) => (
                  <p key={submission.id}>
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

