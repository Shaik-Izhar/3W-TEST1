import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="screen auth-screen">
      <div className="auth-shell">
        <div className="auth-hero">
          <p className="eyebrow">3W Social</p>
          <h1>Welcome back to your social world.</h1>
          <p>Share, follow, and discover stories with a polished community experience.</p>
        </div>
        <div className="card auth-card">
          <div className="auth-intro">
            <p className="eyebrow">Login</p>
            <h1>Sign in</h1>
            <p>Continue where you left off.</p>
          </div>
          <form onSubmit={submit} className="auth-form">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            {error && <p className="error-text">{error}</p>}
            <button type="submit">Login</button>
          </form>
          <div className="auth-footer">
            <p>New here?</p>
            <Link to="/signup">Create account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
