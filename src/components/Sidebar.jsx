import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ role }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const adminLinks = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Projects', path: '/admin/projects' },
    { label: 'Submissions', path: '/admin/submissions' }
  ];

  const studentLinks = [
    { label: 'Dashboard', path: '/student' },
    { label: 'My Projects', path: '/student/projects' },
    { label: 'Submit Work', path: '/submit' }
  ];

  const links = role === 'admin' ? adminLinks : studentLinks;

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button
        className="collapse-btn"
        type="button"
        onClick={() => setCollapsed((prev) => !prev)}
        aria-label="Toggle sidebar"
      >
        {collapsed ? '>>' : '<<'}
      </button>

      <nav>
        {links.map((link) => {
          const active = location.pathname === link.path;
          return (
            <Link key={link.label} to={link.path} className={`sidebar-link ${active ? 'active' : ''}`}>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
