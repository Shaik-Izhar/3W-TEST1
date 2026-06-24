import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const response = await signup({ name, email, password });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="screen auth-screen">
      <div className="auth-shell">
        <div className="auth-hero">
          <p className="eyebrow">3W Social</p>
          <h1>Build your network in a beautiful space.</h1>
          <p>Create an account and start sharing moments, ideas, and inspiring posts with your circle.</p>
        </div>
        <div className="card auth-card">
          <div className="auth-intro">
            <p className="eyebrow">Join 3W</p>
            <h1>Create your account</h1>
            <p>Start sharing stories and growing your community.</p>
          </div>
          <form onSubmit={submit} className="auth-form">
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" />
            {error && <p className="error-text">{error}</p>}
            <button type="submit">Create account</button>
          </form>
          <div className="auth-footer">
            <p>Already have an account?</p>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
