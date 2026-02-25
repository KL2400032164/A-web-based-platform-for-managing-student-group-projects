import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ title = 'Student Project Management System' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="top-navbar">
      <div className="brand-block">
        <h1>{title}</h1>
        <p>{user?.role === 'admin' ? 'Administrator Panel' : 'Student Workspace'}</p>
      </div>
      <div className="nav-actions">
        {user && <span className="user-chip">{user.email}</span>}
        <button type="button" className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
