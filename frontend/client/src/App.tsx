import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import PosPage from './pages/PosPage';
import { HallPage } from './pages/HallPage';
import { OrdersPage } from './pages/OrdersPage';
import { SetupPage } from './pages/SetupPage';
import { PinPadPage } from './pages/PinPadPage';
import React from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const tenantId = localStorage.getItem('pos_tenant_id');
    const token = localStorage.getItem('pos_user_name');

    if (!tenantId) return <Navigate to="/setup" />;
    if (!token) return <Navigate to="/login" />;
    
    return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trasy publiczne / konfiguracyjne */}
        <Route path="/setup" element={<SetupPage />} />
        <Route path="/login" element={<PinPadPage />} />

        {/* Trasy chronione */}
        <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/pos" element={<ProtectedRoute><PosPage /></ProtectedRoute>} />
        <Route path="/hall" element={<ProtectedRoute><HallPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;