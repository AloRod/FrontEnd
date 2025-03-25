/// PrivateRoutes.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoutes = ({ children }) => {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    // Si no hay token, redirige a la página de login
    return <Navigate to="/login" />;
  }

  // Si hay un token, renderiza el contenido protegido
  return children;
};

export default PrivateRoutes;

