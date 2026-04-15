import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageFarmers from './pages/admin/ManageFarmers';
import DailyEntry from './pages/admin/DailyEntry';
import FarmerDashboard from './pages/farmer/FarmerDashboard';

const PrivateRoute = ({ children, roleRequired }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roleRequired && user.role !== roleRequired) return <Navigate to="/" />;
  return children;
};

const AppRoutes = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === 'admin' ? '/admin' : '/farmer'} />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<PrivateRoute roleRequired="admin"><AdminDashboard /></PrivateRoute>} />
      <Route path="/admin/farmers" element={<PrivateRoute roleRequired="admin"><ManageFarmers /></PrivateRoute>} />
      <Route path="/admin/entries" element={<PrivateRoute roleRequired="admin"><DailyEntry /></PrivateRoute>} />
      
      {/* Farmer Routes */}
      <Route path="/farmer" element={<PrivateRoute roleRequired="farmer"><FarmerDashboard /></PrivateRoute>} />

      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
