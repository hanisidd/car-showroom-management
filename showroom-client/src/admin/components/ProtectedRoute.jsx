import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('admin_token');

  if (!token) {
    // Redirect unauthenticated users back to the admin login page
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}