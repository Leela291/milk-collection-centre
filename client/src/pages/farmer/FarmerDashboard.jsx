import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { Droplet, Wallet, Clock, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FarmerDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalMilk: 0, totalEarnings: 0, pendingPayments: 0 });
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, entriesRes] = await Promise.all([
        axios.get('http://localhost:3001/api/farmer/stats'),
        axios.get('http://localhost:3001/api/farmer/entries')
      ]);
      setStats(statsRes.data);
      setEntries(entriesRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Welcome, {user?.name}</h1>
          <p style={{ color: 'var(--text-light)' }}>Farmer ID: {user?.farmer_id}</p>
        </div>
        <button className="secondary" onClick={handleLogout}><LogOut size={18} /> Logout</button>
      </div>

      <div className="stats-grid">
        <div className="glass-panel stat-card">
          <div className="stat-icon"><Droplet size={24} /></div>
          <div className="stat-info">
            <h3>Total Milk Delivered</h3>
            <p>{stats.totalMilk?.toFixed(1)} L</p>
          </div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-icon"><Wallet size={24} /></div>
          <div className="stat-info">
            <h3>Total Earnings</h3>
            <p>₹{stats.totalEarnings?.toFixed(2)}</p>
          </div>
        </div>
        <div className="glass-panel stat-card" style={{ border: '1px solid #fecaca', background: '#fff1f2' }}>
          <div className="stat-icon" style={{ color: '#ef4444', backgroundColor: '#fee2e2' }}><Clock size={24} /></div>
          <div className="stat-info">
            <h3 style={{ color: '#991b1b' }}>Pending Payments</h3>
            <p style={{ color: '#7f1d1d' }}>₹{stats.pendingPayments?.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="glass-panel">
        <h2>Your Milk Entries</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Litres</th>
                <th>Fat %</th>
                <th>Amount (₹)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(entry => (
                <tr key={entry.id}>
                  <td>{entry.date}</td>
                  <td>{entry.litres} L</td>
                  <td>{entry.fat}</td>
                  <td>₹{entry.amount.toFixed(2)}</td>
                  <td><span className={`badge ${entry.payment_status}`}>{entry.payment_status.toUpperCase()}</span></td>
                </tr>
              ))}
              {entries.length === 0 && <tr><td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>No recent entries found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
