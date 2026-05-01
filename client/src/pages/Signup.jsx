import { useState } from 'react';
import { useAuth } from '../App';
import { Link } from 'react-router-dom';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Member');
  const [error, setError] = useState('');
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(name, email, password, role);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || err.message || 'Signup failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card auth-card">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Account</h2>
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Name</label>
            <input type="text" required className="input" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" required className="input" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" required className="input" value={password} onChange={e => setPassword(e.target.value)} minLength={6} />
          </div>
          <div className="input-group">
            <label>Role</label>
            <select className="input" value={role} onChange={e => setRole(e.target.value)} style={{ background: '#1e293b' }}>
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }}>Sign Up</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
