import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import TaskCard from '../components/TaskCard';
import MilestoneTracker from '../components/MilestoneTracker';
import ChatBox from '../components/ChatBox';
import { useAuth } from '../context/AuthContext';
import { projectApi } from '../lib/api';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [studentProjects, setStudentProjects] = useState([]);
  const [error, setError] = useState('');
  const [newTask, setNewTask] = useState('');

  const loadProjects = async () => {
    if (!user) return;
    try {
      const { projects } = await projectApi.list(user);
      setStudentProjects(projects);
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const primaryProject = studentProjects[0];

  const handleTaskStatusChange = async (taskId, status) => {
    if (!primaryProject) return;
    try {
      const { project } = await projectApi.updateTaskStatus({
        projectId: primaryProject.id,
        taskId,
        status
      });
      setStudentProjects((prev) => [project, ...prev.slice(1)]);
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleAddTask = (event) => {
    event.preventDefault();
    if (!newTask.trim() || !primaryProject) return;

    projectApi
      .addTask({ projectId: primaryProject.id, title: newTask.trim() })
      .then(({ project }) => {
        setStudentProjects((prev) => [project, ...prev.slice(1)]);
        setNewTask('');
        setError('');
      })
      .catch((requestError) => {
        setError(requestError.message);
      });
  };

  const handleEditTask = async (taskId, title) => {
    if (!primaryProject) return;

    try {
      const { project } = await projectApi.renameTask({
        projectId: primaryProject.id,
        taskId,
        title
      });
      setStudentProjects((prev) => [project, ...prev.slice(1)]);
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!primaryProject) return;

    try {
      const { project } = await projectApi.deleteTask({
        projectId: primaryProject.id,
        taskId
      });
      setStudentProjects((prev) => [project, ...prev.slice(1)]);
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const overallProgress = useMemo(() => {
    if (!primaryProject?.tasks?.length) return primaryProject?.progress ?? 0;
    const points = { Pending: 0, 'In Progress': 50, Completed: 100 };
    const total = primaryProject.tasks.reduce((sum, task) => sum + (points[task.status] || 0), 0);
    return Math.round(total / primaryProject.tasks.length);
  }, [primaryProject]);

  useEffect(() => {
    document.title = 'Student Dashboard | Student Project Management System';
  }, []);

  useEffect(() => {
    loadProjects();
  }, [user]);

  return (
    <div className="dashboard-shell">
      <Sidebar role="student" />
      <main className="dashboard-main">
        <Navbar title="Student Dashboard" />
        {error && <p className="error-text">{error}</p>}

        <section className="card">
          <h3>Current Project Progress</h3>
          <div className="progress-meta">
            <span>Overall Completion</span>
            <span>{overallProgress}%</span>
          </div>
          <div className="progress-track large">
            <div className="progress-fill" style={{ width: `${overallProgress}%` }} />
          </div>
        </section>

        <section>
          <h2 className="section-heading">Assigned Projects</h2>
          <div className="project-grid">
            {studentProjects.map((project) => (
              <ProjectCard key={project.id} project={project} role="student" />
            ))}
          </div>
        </section>

        {primaryProject && (
          <section className="task-and-milestone-grid">
            <article className="card">
              <div className="task-head">
                <h3>Tasks</h3>
                <form onSubmit={handleAddTask} className="add-task-form">
                  <input
                    type="text"
                    placeholder="Add new task..."
                    value={newTask}
                    onChange={(event) => setNewTask(event.target.value)}
                  />
                  <button type="submit" className="btn btn-primary">
                    Add
                  </button>
                </form>
              </div>
              <div className="task-list">
                {primaryProject.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={handleTaskStatusChange}
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTask}
                  />
                ))}
              </div>
            </article>

            <MilestoneTracker milestones={primaryProject.milestones} />
          </section>
        )}

        <ChatBox projectId={primaryProject?.id} title="Project Group Chat" />
      </main>
    </div>
  );
};

export default StudentDashboard;
