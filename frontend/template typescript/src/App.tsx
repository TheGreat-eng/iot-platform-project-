// ... imports
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './component/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Layout from './pages/Layout';
import DashboardPage from './pages/DashboardPage';
import DeviceDetailPage from './pages/DeviceDetailPage';

function App() {
  return (
    <Routes>
      {/* Thêm routes cho login và register */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="devices/:deviceId" element={<DeviceDetailPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;