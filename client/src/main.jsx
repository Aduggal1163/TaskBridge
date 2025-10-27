import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, Protected } from './auth.jsx';
import LandingPage from './components/LandingPage.jsx';
import AuthPage from './components/AuthPage.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';
import Dashboard from './components/Dashboard.jsx';
import TeamsPage from './pages/Teams.jsx';
import ProjectsPage from './pages/Projects.jsx';
import TasksPage from './pages/Tasks.jsx';
import UsersPage from './pages/Users.jsx';
import MyTasksPage from './pages/MyTasks.jsx';
import './style.css';

function App() {
  
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Authentication */}
          <Route path="/login" element={<AuthPage />} />
          
          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={
            <Protected>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </Protected>
          } />
          
          <Route path="/my-tasks" element={
            <Protected roles={["admin", "project_manager", "team_member"]}>
              <DashboardLayout>
                <MyTasksPage />
              </DashboardLayout>
            </Protected>
          } />
          
          <Route path="/projects" element={
            <Protected roles={["admin", "project_manager"]}>
              <DashboardLayout>
                <ProjectsPage />
              </DashboardLayout>
            </Protected>
          } />
          
          <Route path="/tasks" element={
            <Protected roles={["admin", "project_manager", "team_member"]}>
              <DashboardLayout>
                <TasksPage />
              </DashboardLayout>
            </Protected>
          } />
          
          <Route path="/teams" element={
            <Protected roles={["admin", "project_manager", "team_member"]}>
              <DashboardLayout>
                <TeamsPage />
              </DashboardLayout>
            </Protected>
          } />
          
          <Route path="/users" element={
            <Protected roles={["admin"]}>
              <DashboardLayout>
                <UsersPage />
              </DashboardLayout>
            </Protected>
          } />
          
          {/* Redirect old routes */}
          <Route path="/old-dashboard" element={<Navigate to="/dashboard" replace />} />
          
          {/* Catch all - redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);