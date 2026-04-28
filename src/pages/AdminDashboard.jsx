import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import ChatBox from '../components/ChatBox';
import { useAuth } from '../context/AuthContext';
import { projectApi, userApi } from '../lib/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [projectList, setProjectList] = useState([]);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [activeChatProjectId, setActiveChatProjectId] = useState('');
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    deadline: '',
    assignedStudents: []
  });

  const loadData = async () => {
    if (!user) return;
    try {
      const [{ projects }, { users }] = await Promise.all([projectApi.list(user), userApi.list('student')]);
      setProjectList(projects);
      setStudents(users);
      if (!activeChatProjectId && projects.length) {
        setActiveChatProjectId(projects[0].id);
      }
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleProjectInput = (event) => {
    const { name, value } = event.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleStudentAssign = (studentId) => {
    setNewProject((prev) => {
      const exists = prev.assignedStudents.includes(studentId);
      return {
        ...prev,
        assignedStudents: exists
          ? prev.assignedStudents.filter((id) => id !== studentId)
          : [...prev.assignedStudents, studentId]
      };
    });
  };

  const handleCreateProject = async (event) => {
    event.preventDefault();

    try {
      const { project } = await projectApi.create(newProject);
      setProjectList((prev) => [project, ...prev]);
      setNewProject({ title: '', description: '', deadline: '', assignedStudents: [] });
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const submissionCount = useMemo(
    () => projectList.reduce((sum, project) => sum + project.finalSubmissions.length, 0),
    [projectList]
  );

  useEffect(() => {
    document.title = 'Admin Dashboard | Student Project Management System';
  }, []);

  useEffect(() => {
    loadData();
  }, [user]);

  useEffect(() => {
    if (!projectList.length) {
      setActiveChatProjectId('');
      return;
    }

    const exists = projectList.some((project) => project.id === activeChatProjectId);
    if (!exists) {
      setActiveChatProjectId(projectList[0].id);
    }
  }, [projectList, activeChatProjectId]);

  return (
    <div className="dashboard-shell">
      <Sidebar role="admin" />
      <main className="dashboard-main">
        <Navbar title="Admin Dashboard" />
        {error && <p className="error-text">{error}</p>}

        <section className="stats-row">
          <article className="stat-card">
            <h4>Total Projects</h4>
            <p>{projectList.length}</p>
          </article>
          <article className="stat-card">
            <h4>Total Students</h4>
            <p>{students.length}</p>
          </article>
          <article className="stat-card">
            <h4>Final Submissions</h4>
            <p>{submissionCount}</p>
          </article>
        </section>

        <section className="card create-project-card">
          <h3>Create New Project</h3>
          <form onSubmit={handleCreateProject} className="grid-form">
            <input
              type="text"
              name="title"
              placeholder="Project Title"
              required
              value={newProject.title}
              onChange={handleProjectInput}
            />
            <input
              type="date"
              name="deadline"
              required
              value={newProject.deadline}
              onChange={handleProjectInput}
            />
            <textarea
              name="description"
              placeholder="Project Description"
              required
              value={newProject.description}
              onChange={handleProjectInput}
            />

            <div className="student-select-area">
              <p>Assign Students</p>
              <div className="student-options">
                {students.map((student) => {
                  const checked = newProject.assignedStudents.includes(student.id);
                  return (
                    <label key={student.id} className="student-option">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleStudentAssign(student.id)}
                      />
                      <span>{student.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              Create Project
            </button>
          </form>
        </section>

        <section>
          <h2 className="section-heading">Project Overview</h2>
          <div className="project-grid">
            {projectList.map((project) => (
              <ProjectCard key={project.id} project={project} role="admin" />
            ))}
          </div>
        </section>

        <section className="card">
          <h3>Final Submissions</h3>
          <div className="submission-list">
            {projectList.map((project) =>
              project.finalSubmissions.length ? (
                <article key={project.id} className="submission-item">
                  <h4>{project.title}</h4>
                  {project.finalSubmissions.map((submission) => (
                    <p key={submission.id}>
                      {submission.studentId}: {submission.comment}
                    </p>
                  ))}
                </article>
              ) : null
            )}
            {!submissionCount && <p className="empty-text">No submissions yet.</p>}
          </div>
        </section>

        <section className="card">
          <div className="chat-project-head">
            <h3>Project Chat Rooms</h3>
            <select value={activeChatProjectId} onChange={(event) => setActiveChatProjectId(event.target.value)}>
              {projectList.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>

          <ChatBox
            projectId={activeChatProjectId}
            title={
              activeChatProjectId
                ? `Chat: ${projectList.find((project) => project.id === activeChatProjectId)?.title || 'Project'}`
                : 'Project Chat'
            }
          />
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
