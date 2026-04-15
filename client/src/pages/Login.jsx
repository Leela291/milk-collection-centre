import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Droplet, Lock, User } from 'lucide-react';

const Login = () => {
  const [farmerId, setFarmerId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(farmerId, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/farmer');
      }
    } catch (err) {
      setError('Invalid ID or Password');
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel auth-card">
        <div className="auth-title">
          <div style={{ background: 'var(--primary-light)', padding: '1rem', borderRadius: '50%', color: 'white' }}>
            <Droplet size={32} />
          </div>
          <h2>Milk Collection Center</h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>Sign in to your account</p>
        </div>
        
        {error && <div style={{ color: '#d32f2f', marginBottom: '1rem', textAlign: 'center', background: '#ffebee', padding: '0.5rem', borderRadius: '0.5rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={16} /> ID / Username</label>
            <input 
              type="text" 
              value={farmerId} 
              onChange={(e) => setFarmerId(e.target.value)} 
              placeholder="e.g. admin or 01"
              required 
            />
          </div>
          <div className="input-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Lock size={16} /> Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              required 
            />
          </div>
          <button type="submit" className="full-width" style={{ marginTop: '1rem' }}>Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
