import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ModuleDetail from './pages/ModuleDetail';
import Lesson from './pages/Lesson';
import AdminUsers from './pages/AdminUsers';
import AdminProgress from './pages/AdminProgress';
import AdminTrainings from './pages/AdminTrainings';
import Trainings from './pages/Trainings';
import Certificate from './pages/Certificate';
import Preview from './pages/Preview';
import CertificateShowcase from './pages/CertificateShowcase';
import SectorDetail from './pages/SectorDetail';
import TrainingDetail from './pages/TrainingDetail';
import { authenticateUser, clearCurrentUser, getCurrentUser } from "./api/usersStorage";
import { canAccessAdminArea } from './data/sectorAccess';
import { readStorageValue, writeStorageValue } from './data/runtime';
import { bootstrapBackendSnapshot } from "./api/backendSync";

const THEME_STORAGE_KEY = 'portalTreinamentos.theme';

const getInitialTheme = () => {
  const storedTheme = readStorageValue(THEME_STORAGE_KEY, null);

  if (storedTheme === 'dark' || storedTheme === 'light') {
    return storedTheme;
  }

  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
};

import { ToastProvider } from './context/ToastContext';

function App() {
  // ... rest of component
  return (
    <ToastProvider>
      <Router>
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={isDarkTheme ? 'Ativar modo claro' : 'Ativar modo noturno'}
          title={isDarkTheme ? 'Modo claro' : 'Modo noturno'}
        >
          {isDarkTheme ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <Routes>
          {/* ... routes ... */}
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
