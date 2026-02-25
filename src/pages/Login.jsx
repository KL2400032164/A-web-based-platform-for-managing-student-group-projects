import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', role: 'student' });
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Student group Project Status';
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = login(formData);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate(result.user.role === 'admin' ? '/admin' : '/student');
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2 className="login-title">Student group Project Status</h2>
        <p>Use admin@gmail.com or student@gmail.com credentials.</p>

        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
        />

        <label htmlFor="role">Role</label>
        <select id="role" name="role" value={formData.role} onChange={handleChange}>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="btn btn-primary full-width">
          Login
        </button>

        <p className="switch-link">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
