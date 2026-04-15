import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import axios from 'axios';
import { UserPlus } from 'lucide-react';

const ManageFarmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    const res = await axios.get('http://localhost:3001/api/admin/farmers');
    setFarmers(res.data);
  };

  const handleAddFarmer = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/admin/farmers', { name, contact, password });
      setName('');
      setContact('');
      setPassword('');
      fetchFarmers();
      alert('Farmer added successfully!');
    } catch (err) {
      alert('Error adding farmer');
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Add Farmer Form */}
        <div className="glass-panel" style={{ flex: '1', minWidth: '300px' }}>
          <h2><UserPlus size={24} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> Add New Farmer</h2>
          <form onSubmit={handleAddFarmer}>
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Contact Number</label>
              <input type="text" value={contact} onChange={e => setContact(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Initial Login Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Default: password123" />
            </div>
            <button type="submit" className="full-width">Save Farmer</button>
            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-light)' }}>
              A unique Farmer ID (e.g. 01, 02) will be auto-generated.
            </p>
          </form>
        </div>

        {/* Farmer List */}
        <div className="glass-panel" style={{ flex: '2', minWidth: '400px' }}>
          <h2>Registered Farmers</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                {farmers.map(f => (
                  <tr key={f.id}>
                    <td><span style={{ fontWeight: '600' }}>{f.farmer_id}</span></td>
                    <td>{f.name}</td>
                    <td>{f.contact}</td>
                  </tr>
                ))}
                {farmers.length === 0 && <tr><td colSpan="3" style={{textAlign: 'center'}}>No farmers registered yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageFarmers;
