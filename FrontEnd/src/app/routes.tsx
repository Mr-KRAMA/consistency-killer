import React from 'react';
import { createBrowserRouter } from 'react-router';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Fitness } from './pages/Fitness';
import { Diet } from './pages/Diet';
import { Analytics } from './pages/Analytics';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { ProtectedRoute } from './App';

const protect = (Component: React.ComponentType) => (
  <ProtectedRoute><Component /></ProtectedRoute>
);

export const router = createBrowserRouter([
  { path: '/', Component: Login },
  { path: '/dashboard', element: protect(Dashboard) },
  { path: '/tasks', element: protect(Tasks) },
  { path: '/fitness', element: protect(Fitness) },
  { path: '/diet', element: protect(Diet) },
  { path: '/analytics', element: protect(Analytics) },
  { path: '/reports', element: protect(Reports) },
  { path: '/settings', element: protect(Settings) },
]);
