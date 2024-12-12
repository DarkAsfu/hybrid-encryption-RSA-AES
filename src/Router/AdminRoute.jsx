import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Use named import

const AdminRoute = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decodedToken = jwtDecode(token); // Decode the token using the named import
    if (decodedToken.role !== 'Admin') {
      return <Navigate to="/not-authorized" />;
    }
    return <Outlet />;
  } catch (err) {
    console.error('Error decoding token:', err);
    return <Navigate to="/login" />;
  }
};

export default AdminRoute;
