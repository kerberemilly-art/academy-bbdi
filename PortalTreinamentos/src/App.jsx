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
import { authenticateUser, clearCurrentUser, getCurrentUser } from './data/usersStorage';
import { canAccessAdminArea } from './data/sectorAccess';
import { readStorageValue, writeStorageValue } from './data/runtime';
import { bootstrapBackendSnapshot } from './data/backendSync';

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

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [theme, setTheme] = useState(getInitialTheme);
  const [appReady, setAppReady] = useState(false);
  const isAuthenticated = Boolean(currentUser);
  const isDarkTheme = theme === 'dark';

  useEffect(() => {
    let cancelled = false;

    (async () => {
      await bootstrapBackendSnapshot();

      if (!cancelled) {
        setCurrentUser(getCurrentUser());
        setAppReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = theme;
    }

    writeStorageValue(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const handleLogin = (email, password) => {
    const user = authenticateUser(email, password.trim());
    if (user) {
      setCurrentUser(user);
      return true;
    }

    return false;
  };

  const handleLogout = () => {
    clearCurrentUser();
    setCurrentUser(null);
  };

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  if (!appReady) {
    return (
      <div className="app-bootstrap-screen">
        <div className="app-bootstrap-card glass-panel">
          <span>Carregando aplicação...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <button
        type="button"
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={isDarkTheme ? 'Ativar modo claro' : 'Ativar modo noturno'}
        title={isDarkTheme ? 'Modo claro' : 'Modo noturno'}
      >
        {isDarkTheme ? <Sun size={20} /> : <Moon size={20} />}
        <span>{isDarkTheme ? 'Claro' : 'Noturno'}</span>
      </button>
      <Routes>
        <Route path="/" element={<CertificateShowcase />} />
        <Route path="/certificate-showcase" element={<CertificateShowcase />} />
        <Route path="/preview" element={<Preview />} />
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? <Dashboard currentUser={currentUser} onLogout={handleLogout} /> : <Navigate to="/login" />
          } 
        />
        <Route
          path="/trainings"
          element={
            isAuthenticated ? <Trainings currentUser={currentUser} onLogout={handleLogout} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/sector/:id"
          element={
            isAuthenticated ? <SectorDetail currentUser={currentUser} onLogout={handleLogout} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/training/:id"
          element={
            isAuthenticated ? <TrainingDetail currentUser={currentUser} onLogout={handleLogout} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/admin/users"
          element={
            canAccessAdminArea(currentUser)
              ? <AdminUsers currentUser={currentUser} />
              : <Navigate to={isAuthenticated ? '/dashboard' : '/login'} />
          }
        />
        <Route
          path="/admin/progress"
          element={
            canAccessAdminArea(currentUser)
              ? <AdminProgress currentUser={currentUser} />
              : <Navigate to={isAuthenticated ? '/dashboard' : '/login'} />
          }
        />
        <Route
          path="/admin/trainings"
          element={
            canAccessAdminArea(currentUser)
              ? <AdminTrainings currentUser={currentUser} />
              : <Navigate to={isAuthenticated ? '/dashboard' : '/login'} />
          }
        />
        <Route
          path="/module/:id" 
          element={
            isAuthenticated ? <ModuleDetail currentUser={currentUser} /> : <Navigate to="/login" />
          } 
        />
        <Route
          path="/certificate"
          element={<Certificate currentUser={currentUser} onLogout={handleLogout} />}
        />
        <Route 
          path="/lesson/:moduleId/:levelId" 
          element={
            isAuthenticated ? <Lesson currentUser={currentUser} /> : <Navigate to="/login" />
          } 
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
