import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

// Import All Pages
import Login from './pages/Login';
import OperatorDashboard from './pages/operator/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import AdminLeads from './pages/admin/AdminLeads'; // This was the missing import
import OwnerDashboard from './pages/owner/Dashboard';
import LeadDetails from './pages/LeadDetails';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        
        {/* Protected Routes - Common for all logged in users */}
        <Route path="/lead/:id" element={user ? <LeadDetails /> : <Navigate to="/login" />} />

        {/* Dynamic Home Route based on Role */}
        <Route path="/" element={
          user ? (
            user.role === 'admin' ? <AdminDashboard /> :
            user.role === 'owner' ? <OwnerDashboard /> :
            <OperatorDashboard />
          ) : <Navigate to="/login" />
        } />

        {/* Specific Admin Routes */}
        {user?.role === 'admin' && (
          <Route path="/admin/leads" element={<AdminLeads />} />
        )}

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
