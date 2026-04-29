import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import axios from 'axios';
import { UserPlus, Edit2, Trash2 } from 'lucide-react';

const ManageFarmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    const res = await axios.get('/api/admin/farmers');
    setFarmers(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/admin/farmers/${editingId}`, { name, contact });
        alert('Farmer updated successfully!');
      } else {
        await axios.post('/api/admin/farmers', { name, contact, password });
        alert('Farmer added successfully!');
      }
      cancelEdit();
      fetchFarmers();
    } catch (err) {
      alert('Error saving farmer');
    }
  };

  const handleEdit = (farmer) => {
    setEditingId(farmer.id);
    setName(farmer.name);
    setContact(farmer.contact);
    setPassword(''); // usually hidden or keep empty
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setContact('');
    setPassword('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this farmer AND all their milk entries permanently?')) return;
    try {
      await axios.delete(`/api/admin/farmers/${id}`);
      alert('Farmer deleted!');
      fetchFarmers();
    } catch (err) {
      alert('Error deleting farmer');
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Add/Edit Farmer Form */}
        <div className="glass-panel" style={{ flex: '1', minWidth: '300px' }}>
          <h2>{editingId ? <Edit2 size={24} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> : <UserPlus size={24} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />} {editingId ? 'Edit Farmer' : 'Add New Farmer'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Contact Number</label>
              <input type="text" value={contact} onChange={e => setContact(e.target.value)} required />
            </div>
            {!editingId && (
              <div className="input-group">
                <label>Initial Login Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Default: password123" />
              </div>
            )}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="full-width">{editingId ? 'Update Farmer' : 'Save Farmer'}</button>
              {editingId && (
                <button type="button" className="secondary" onClick={cancelEdit}>Cancel</button>
              )}
            </div>
            {!editingId && (
              <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-light)' }}>
                A unique Farmer ID (e.g. 01, 02) will be auto-generated.
              </p>
            )}
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {farmers.map(f => (
                  <tr key={f.id}>
                    <td><span style={{ fontWeight: '600' }}>{f.farmer_id}</span></td>
                    <td>{f.name}</td>
                    <td>{f.contact}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleEdit(f)} style={{ padding: '0.4rem', background: '#3b82f6' }} title="Edit"><Edit2 size={16}/></button>
                        <button onClick={() => handleDelete(f.id)} style={{ padding: '0.4rem', background: '#ef4444' }} title="Delete"><Trash2 size={16}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {farmers.length === 0 && <tr><td colSpan="4" style={{textAlign: 'center'}}>No farmers registered yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageFarmers;
