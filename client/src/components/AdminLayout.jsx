import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Users, PlusCircle, LogOut, Droplet } from 'lucide-react';

const AdminLayout = ({ children }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <h2><Droplet color="var(--primary)" /> Milk Center</h2>
        <div style={{ marginTop: '2rem' }}>
          <NavLink to="/admin" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} end>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/admin/farmers" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
            <Users size={20} /> Manage Farmers
          </NavLink>
          <NavLink to="/admin/entries" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
            <PlusCircle size={20} /> Daily Entries
          </NavLink>
        </div>
        <div style={{ flex: 1 }}></div>
        <button onClick={handleLogout} className="secondary full-width"><LogOut size={20} /> Logout</button>
      </div>
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
