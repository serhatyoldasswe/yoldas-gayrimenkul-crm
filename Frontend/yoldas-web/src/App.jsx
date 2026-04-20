import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import IlanlarPage from './pages/IlanlarPage';
import MusterilerPage from './pages/MusterilerPage';
import PortfoylerPage from './pages/PortfoylerPage';
import AnalizPage from './pages/AnalizPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',fontSize:14,color:'#6b7280' }}>Yükleniyor...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<DashboardPage />} />
            <Route path="ilanlar" element={<IlanlarPage />} />
            <Route path="musteriler" element={<MusterilerPage />} />
            <Route path="portfoyler" element={<PortfoylerPage />} />
            <Route path="analiz" element={<AnalizPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}