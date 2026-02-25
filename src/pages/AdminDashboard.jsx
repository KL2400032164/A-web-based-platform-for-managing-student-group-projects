import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import { projects, students } from '../data/dummyData';

const AdminDashboard = () => {
  const [projectList, setProjectList] = useState(projects);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    deadline: '',
    assignedStudents: []
  });

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

  const handleCreateProject = (event) => {
    event.preventDefault();

    const createdProject = {
      id: `p${Date.now()}`,
      title: newProject.title,
      description: newProject.description,
      deadline: newProject.deadline,
      assignedStudents: newProject.assignedStudents,
      milestones: [
        { id: 'm1', label: 'Kickoff', completion: 0 },
        { id: 'm2', label: 'Development', completion: 0 },
        { id: 'm3', label: 'Final Review', completion: 0 }
      ],
      tasks: [
        { id: 't1', title: 'Requirement Analysis', status: 'Pending' },
        { id: 't2', title: 'Core Implementation', status: 'Pending' },
        { id: 't3', title: 'Testing', status: 'Pending' }
      ],
      finalSubmissions: []
    };

    setProjectList((prev) => [createdProject, ...prev]);
    setNewProject({ title: '', description: '', deadline: '', assignedStudents: [] });
  };

  const submissionCount = useMemo(
    () => projectList.reduce((sum, project) => sum + project.finalSubmissions.length, 0),
    [projectList]
  );

  useEffect(() => {
    document.title = 'Admin Dashboard | Student Project Management System';
  }, []);

  return (
    <div className="dashboard-shell">
      <Sidebar role="admin" />
      <main className="dashboard-main">
        <Navbar title="Admin Dashboard" />

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
                  {project.finalSubmissions.map((submission, index) => (
                    <p key={`${project.id}-${index}`}>
                      {submission.studentId}: {submission.comment}
                    </p>
                  ))}
                </article>
              ) : null
            )}
            {!submissionCount && <p className="empty-text">No submissions yet.</p>}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
