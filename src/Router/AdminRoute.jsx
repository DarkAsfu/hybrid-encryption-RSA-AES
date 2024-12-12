import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Use named import
import Dashboard from '../Layouts/Dashboard';

const AdminRoute = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/auth/login" />;
  }

  try {
    const decodedToken = jwtDecode(token); // Decode the token using the named import
    if (decodedToken.role !== 'Admin') {
      return <Navigate to="/not-authorized" />;
    }
    return <Dashboard/>;
  } catch (err) {
    console.error('Error decoding token:', err);
    return <Navigate to="/auth/login" />;
  }
};

export default AdminRoute;
