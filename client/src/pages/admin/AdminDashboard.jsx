import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import axios from 'axios';
import { Users, Droplet, Wallet, Clock, Download } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalFarmers: 0, totalMilk: 0, totalPayments: 0, pendingPayments: 0 });
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchEntries();
  }, []);

  const fetchStats = async () => {
    const res = await axios.get('http://localhost:3001/api/admin/stats');
    setStats(res.data);
  };

  const fetchEntries = async () => {
    const res = await axios.get('http://localhost:3001/api/admin/entries');
    setEntries(res.data);
  };

  const markAsPaid = async (id) => {
    await axios.put('http://localhost:3001/api/admin/entries/pay', { entryIds: [id] });
    fetchStats();
    fetchEntries();
  };

  const downloadCSV = () => {
     const csvLines = ['Date,Farmer ID,Farmer Name,Litres,Fat %,Amount (INR),Status'];
     entries.forEach(e => {
         csvLines.push(`${e.date},${e.farmer_id},${e.name},${e.litres},${e.fat},${e.amount},${e.payment_status}`);
     });
     const blob = new Blob([csvLines.join('\n')], { type: 'text/csv' });
     const url = window.URL.createObjectURL(blob);
     const a = document.createElement('a'); 
     a.href = url; 
     a.download = 'milk_records.csv'; 
     a.click();
  };

  return (
    <AdminLayout>
      <h1>Dashboard Overview</h1>
      
      <div className="stats-grid">
        <div className="glass-panel stat-card">
          <div className="stat-icon"><Users size={24} /></div>
          <div className="stat-info">
            <h3>Total Farmers</h3>
            <p>{stats.totalFarmers}</p>
          </div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-icon"><Droplet size={24} /></div>
          <div className="stat-info">
            <h3>Total Milk</h3>
            <p>{stats.totalMilk.toFixed(1)} L</p>
          </div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-icon"><Wallet size={24} /></div>
          <div className="stat-info">
            <h3>Total Paid</h3>
            <p>₹{stats.totalPayments.toFixed(2)}</p>
          </div>
        </div>
        <div className="glass-panel stat-card" style={{ border: '1px solid #fecaca', background: '#fff1f2' }}>
          <div className="stat-icon" style={{ color: '#ef4444', backgroundColor: '#fee2e2' }}><Clock size={24} /></div>
          <div className="stat-info">
            <h3 style={{ color: '#991b1b' }}>Pending Payments</h3>
            <p style={{ color: '#7f1d1d' }}>₹{stats.pendingPayments.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="glass-panel">
        <div className="action-bar">
          <h2>Recent Entries</h2>
          <button className="secondary" onClick={downloadCSV}><Download size={18} /> Export CSV</button>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Farmer</th>
                <th>Litres</th>
                <th>Fat</th>
                <th>Amount (₹)</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {entries.slice(0, 15).map(entry => (
                <tr key={entry.id}>
                  <td>{entry.date}</td>
                  <td>{entry.name} <br/><span style={{fontSize:'0.75rem', color: 'var(--text-light)'}}>ID: {entry.farmer_id}</span></td>
                  <td>{entry.litres}</td>
                  <td>{entry.fat}</td>
                  <td>₹{entry.amount.toFixed(2)}</td>
                  <td><span className={`badge ${entry.payment_status}`}>{entry.payment_status.toUpperCase()}</span></td>
                  <td>
                    {entry.payment_status === 'pending' ? (
                      <button onClick={() => markAsPaid(entry.id)} style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}>Mark Paid</button>
                    ) : '-'}
                  </td>
                </tr>
              ))}
              {entries.length === 0 && <tr><td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>No recent entries found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
