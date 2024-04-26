import React from 'react';
import { useNavigate } from 'react-router-dom';

function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Access Denied</h2>
      <p>You must be logged in to view this page.</p>
      <button onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>Back to Login</button>
    </div>
  );
}

export default ErrorPage;
