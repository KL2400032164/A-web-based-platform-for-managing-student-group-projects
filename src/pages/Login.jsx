import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OTP_STORAGE_KEY = 'spms_login_otp';

const normalizePhone = (value) => value.replace(/\D/g, '');

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student',
    phone: '',
    otp: ''
  });
  const [error, setError] = useState('');
  const [otpInfo, setOtpInfo] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    document.title = 'Student group Project Status';
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'phone' ? normalizePhone(value) : value }));
    if (error) setError('');
  };

  const handleSendOtp = () => {
    const phone = normalizePhone(formData.phone);
    if (phone.length !== 10) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }

    const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
    const otpPayload = {
      phone,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    };

    localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(otpPayload));
    setOtpSent(true);
    setError('');
    // Demo mode: surface OTP in UI since there is no SMS gateway/backend yet.
    setOtpInfo(`OTP sent to +91 ${phone}. Demo OTP: ${otp}`);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const phone = normalizePhone(formData.phone);
    if (phone.length !== 10) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }

    const rawOtpData = localStorage.getItem(OTP_STORAGE_KEY);
    if (!rawOtpData) {
      setError('Please request OTP first.');
      return;
    }

    const otpData = JSON.parse(rawOtpData);
    if (Date.now() > otpData.expiresAt) {
      setError('OTP expired. Please request a new OTP.');
      setOtpSent(false);
      localStorage.removeItem(OTP_STORAGE_KEY);
      return;
    }

    if (otpData.phone !== phone) {
      setError('OTP was sent to a different mobile number.');
      return;
    }

    if (formData.otp.trim() !== otpData.otp) {
      setError('Invalid OTP.');
      return;
    }

    const result = login(formData);

    if (!result.success) {
      setError(result.message);
      return;
    }

    localStorage.removeItem(OTP_STORAGE_KEY);
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

        <label htmlFor="phone">Phone Number</label>
        <div className="otp-row">
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="10-digit mobile number"
            required
            value={formData.phone}
            onChange={handleChange}
            maxLength={10}
          />
          <button type="button" className="btn btn-secondary otp-btn" onClick={handleSendOtp}>
            Send OTP
          </button>
        </div>

        <label htmlFor="otp">OTP</label>
        <input
          id="otp"
          name="otp"
          type="text"
          placeholder="Enter 6-digit OTP"
          required
          value={formData.otp}
          onChange={handleChange}
          maxLength={6}
        />

        <label htmlFor="role">Role</label>
        <select id="role" name="role" value={formData.role} onChange={handleChange}>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>

        {otpSent && otpInfo && <p className="info-text">{otpInfo}</p>}
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
