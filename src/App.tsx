import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import EnhancedAuditWizard from './pages/audit/EnhancedAuditWizard';
import SuccessPage from './pages/SuccessPage';
import CancelPage from './pages/CancelPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cancel" element={<CancelPage />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/audit/new" element={
            <ProtectedRoute>
              <EnhancedAuditWizard />
            </ProtectedRoute>
          } />
          
          {/* Redirect old dashboard routes */}
          <Route path="/dashboard/upload" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard/review" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard/generate" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;