import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import TaskCard from '../components/TaskCard';
import MilestoneTracker from '../components/MilestoneTracker';
import { projects } from '../data/dummyData';

const SUBMISSION_STATUS_KEY = 'spms_student_submission_done';

const StudentDashboard = () => {
  const initialProjects = projects.filter((project) => project.assignedStudents.includes('s1'));
  const [studentProjects, setStudentProjects] = useState(initialProjects);
  const [hasSubmittedWork, setHasSubmittedWork] = useState(false);

  const primaryProject = studentProjects[0];

  const handleTaskStatusChange = (taskId, status) => {
    setStudentProjects((prev) =>
      prev.map((project, index) => {
        if (index !== 0) return project;
        return {
          ...project,
          tasks: project.tasks.map((task) => (task.id === taskId ? { ...task, status } : task))
        };
      })
    );
  };

  const overallProgress = hasSubmittedWork ? 50 : 0;

  const handleResetProgress = () => {
    localStorage.removeItem(SUBMISSION_STATUS_KEY);
    setHasSubmittedWork(false);
  };

  useEffect(() => {
    document.title = 'Student Dashboard | Student Project Management System';
  }, []);

  useEffect(() => {
    setHasSubmittedWork(localStorage.getItem(SUBMISSION_STATUS_KEY) === 'true');
  }, []);

  return (
    <div className="dashboard-shell">
      <Sidebar role="student" />
      <main className="dashboard-main">
        <Navbar title="Student Dashboard" />

        <section className="card">
          <h3>Current Project Progress</h3>
          <div className="progress-meta">
            <span>Overall Completion</span>
            <span>{overallProgress}%</span>
          </div>
          <div className="progress-track large">
            <div className="progress-fill" style={{ width: `${overallProgress}%` }} />
          </div>
          <div className="card-actions">
            <button type="button" className="btn btn-secondary" onClick={handleResetProgress}>
              Reset Progress
            </button>
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
              <h3>Tasks</h3>
              <div className="task-list">
                {primaryProject.tasks.map((task) => (
                  <TaskCard key={task.id} task={task} onStatusChange={handleTaskStatusChange} />
                ))}
              </div>
            </article>

            <MilestoneTracker milestones={primaryProject.milestones} />
          </section>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
