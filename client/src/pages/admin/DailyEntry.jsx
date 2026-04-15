import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import axios from 'axios';
import { PlusCircle, Info } from 'lucide-react';

// Shared Price Logic
function getPriceForFat(fat) {
    const table = [
        { f: 5.0, p: 35 },
        { f: 6.0, p: 46 },
        { f: 7.0, p: 54 },
        { f: 8.0, p: 61 },
        { f: 9.0, p: 69 },
        { f: 10.0, p: 77 }
    ];
    if (fat <= 5.0) return 35;
    if (fat >= 10.0) return 77;
    
    for (let i = 0; i < table.length - 1; i++) {
        const low = table[i];
        const high = table[i+1];
        if (fat >= low.f && fat <= high.f) {
            const fraction = (fat - low.f) / (high.f - low.f);
            return low.p + fraction * (high.p - low.p);
        }
    }
    return 35;
}

const DailyEntry = () => {
  const [farmers, setFarmers] = useState([]);
  const [formData, setFormData] = useState({ farmer_int_id: '', date: new Date().toISOString().split('T')[0], litres: '', fat: '' });
  
  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    const res = await axios.get('http://localhost:3001/api/admin/farmers');
    setFarmers(res.data);
  };

  const calculatedAmount = formData.litres && formData.fat 
       ? (parseFloat(formData.litres) * getPriceForFat(parseFloat(formData.fat))) 
       : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/admin/entries', formData);
      alert('Entry added successfully!');
      setFormData({ ...formData, litres: '', fat: '' });
    } catch (err) {
      alert('Error saving entry');
    }
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="glass-panel">
          <h2><PlusCircle size={24} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> New Milk Entry</h2>
          
          <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
            <div className="input-group">
              <label>Select Farmer</label>
              <select 
                value={formData.farmer_int_id} 
                onChange={e => setFormData({...formData, farmer_int_id: e.target.value})} 
                required
              >
                <option value="">-- Choose a Farmer --</option>
                {farmers.map(f => (
                  <option key={f.id} value={f.id}>{f.name} (ID: {f.farmer_id})</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Date</label>
              <input 
                type="date" 
                value={formData.date} 
                onChange={e => setFormData({...formData, date: e.target.value})} 
                required 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="input-group">
                <label>Litres</label>
                <input 
                  type="number" 
                  step="0.1" 
                  min="0"
                  value={formData.litres} 
                  onChange={e => setFormData({...formData, litres: e.target.value})} 
                  placeholder="e.g. 10.5"
                  required 
                />
              </div>

              <div className="input-group">
                <label>Fat %</label>
                <input 
                  type="number" 
                  step="0.1"
                  min="0"
                  value={formData.fat} 
                  onChange={e => setFormData({...formData, fat: e.target.value})} 
                  placeholder="e.g. 6.5"
                  required 
                />
              </div>
            </div>

            <div style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', border: '1px solid var(--primary-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-dark)', fontWeight: 500 }}>
                  <Info size={18} /> Estimated Price:
                </span>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
                  ₹{calculatedAmount.toFixed(2)}
                </span>
              </div>
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-light)', textAlign: 'right' }}>
                (₹{formData.fat ? getPriceForFat(parseFloat(formData.fat)).toFixed(2) : '0.00'} / Litre)
              </p>
            </div>

            <button type="submit" className="full-width" disabled={!formData.farmer_int_id}>Save Entry</button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DailyEntry;
