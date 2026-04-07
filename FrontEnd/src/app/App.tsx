import React from 'react';
import { RouterProvider, Navigate } from 'react-router';
import { router } from './routes';
import { AuthProvider, useAuth } from './context/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <div className="dark">
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </div>
  );
}
