import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/LoginPage';
import KasirPage from './pages/kasir/kasirPage';
import ManajerPage from './pages/manajer/ManajerPage';
import Dashboard from './pages/admin/Dashboard';
import RouteGuard from './routeGuards';
import NotFoundPage from './pages/NotFoundPage';
import UserPage from './pages/admin/UserPage';
import MejaPage from './pages/admin/MejaPage';
import MenuPage from './pages/admin/MenuPage';
import TransaksiPage from './pages/admin/TransaksiPage';
import DaftarTransaksi from './pages/kasir/DaftarTransaksiPage';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/kasir"
        element={
          <RouteGuard allowedRoles={['kasir']}>
            <KasirPage />
          </RouteGuard>
        }
      />
      <Route
        path="/kasir/daftar-transaksi"
        element={
          <RouteGuard allowedRoles={['kasir']}>
            <DaftarTransaksi />
          </RouteGuard>
        }
      />
      <Route
        path="/manajer"
        element={
          <RouteGuard allowedRoles={['manajer']}>
            <ManajerPage />
          </RouteGuard>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <RouteGuard allowedRoles={['admin']}>
            <Dashboard />
          </RouteGuard>
        }
      />
      <Route
        path="/admin/user"
        element={
          <RouteGuard allowedRoles={['admin']}>
            <UserPage />
          </RouteGuard>
        }
      />
      <Route
        path="/admin/menu"
        element={
          <RouteGuard allowedRoles={['admin']}>
            <MenuPage />
          </RouteGuard>
        }
      />
      <Route
        path="/admin/meja"
        element={
          <RouteGuard allowedRoles={['admin']}>
            <MejaPage />
          </RouteGuard>
        }
      />
      <Route
        path="/admin/transaksi"
        element={
          <RouteGuard allowedRoles={['admin']}>
            <TransaksiPage />
          </RouteGuard>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
