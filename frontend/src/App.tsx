import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import * as Sentry from '@sentry/react';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleGuard from './components/auth/RoleGuard';
import DashboardLayout from './layouts/DashboardLayout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';

import LeadDetail from './pages/LeadDetail';
import Approvals from './pages/Approvals';
import Social from './pages/Social';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';

// Placeholder components
const Billing = () => <div className="p-8">Billing Plans</div>;

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Toaster position="top-right" />
            
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Protected Routes inside Layout */}
              <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/leads" element={<Leads />} />
                <Route path="/leads/:id" element={<LeadDetail />} />
                <Route path="/billing" element={<Billing />} />
                <Route path="/social" element={<Social />} />
                
                {/* Admin-only Routes */}
                <Route path="/approvals" element={
                  <RoleGuard allowedRoles={['admin', 'manager']}>
                    <Approvals />
                  </RoleGuard>
                } />
                <Route path="/settings" element={
                  <RoleGuard allowedRoles={['admin']}>
                    <Settings />
                  </RoleGuard>
                } />
                <Route path="/analytics" element={<Analytics />} />
              </Route>
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN || "https://35ee2de60aacd8217b5bb96779d106ac@o4511072180371456.ingest.us.sentry.io/4511072193740800",
  tracesSampleRate: 1.0,
});

export default Sentry.withErrorBoundary(App, { fallback: <p>Critical Error</p> });
