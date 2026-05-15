import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ModuleDetail from './pages/ModuleDetail';
import Lesson from './pages/Lesson';
import AdminUsers from './pages/AdminUsers';
import AdminProgress from './pages/AdminProgress';
import Trainings from './pages/Trainings';
import { authenticateUser, clearCurrentUser, getCurrentUser } from './data/usersStorage';

function App() {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const isAuthenticated = Boolean(currentUser);

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

  return (
    <Router>
      <Routes>
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
          path="/admin/users"
          element={
            currentUser?.role === 'master'
              ? <AdminUsers />
              : <Navigate to={isAuthenticated ? '/dashboard' : '/login'} />
          }
        />
        <Route
          path="/admin/progress"
          element={
            currentUser?.role === 'master'
              ? <AdminProgress />
              : <Navigate to={isAuthenticated ? '/dashboard' : '/login'} />
          }
        />
        <Route 
          path="/module/:id" 
          element={
            isAuthenticated ? <ModuleDetail /> : <Navigate to="/login" />
          } 
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
