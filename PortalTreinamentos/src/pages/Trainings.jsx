import { ArrowLeft, Battery, BookOpen, CheckCircle, ClipboardCheck, Cpu, HardDrive, Keyboard, LogOut, Monitor, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { modulesData } from '../data/modulesData';
import './Dashboard.css';

const Trainings = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const displayName = currentUser.name?.trim() || 'Usuário';
  const getLevelCount = (id) => modulesData[id]?.levels?.length ?? 0;

  const modules = [
    { id: 1, title: 'Baterias', icon: Battery, color: '#3b82f6', count: getLevelCount(1), progress: 0 },
    { id: 2, title: 'Fontes', icon: Zap, color: '#10b981', count: getLevelCount(2), progress: 0 },
    { id: 3, title: 'Telas', icon: Monitor, color: '#8b5cf6', count: getLevelCount(3), progress: 0 },
    { id: 4, title: 'Teclados', icon: Keyboard, color: '#f59e0b', count: getLevelCount(4), progress: 0 },
    { id: 5, title: 'Memórias', icon: Cpu, color: '#ef4444', count: getLevelCount(5), progress: 0 },
    { id: 6, title: 'SSD', icon: HardDrive, color: '#06b6d4', count: getLevelCount(6), progress: 0 },
    { id: 8, title: 'Compatibilidade', icon: CheckCircle, color: '#f97316', count: getLevelCount(8), progress: 0 },
    { id: 7, title: 'Avaliação Final Produtos', icon: ClipboardCheck, color: '#14b8a6', count: getLevelCount(7), progress: 0 },
  ];

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header glass-panel">
        <div className="header-content container">
          <div className="header-logo">
            <button className="btn-back compact" onClick={() => navigate('/dashboard')}>
              <ArrowLeft size={20} />
              <span>Voltar</span>
            </button>
            <BookOpen size={28} color="var(--accent-color)" />
            <h2>Treinamento BBDI</h2>
          </div>
          <div className="header-actions">
            <div className="user-profile">
              <div className="avatar">{displayName.charAt(0).toUpperCase()}</div>
              <span>{displayName}</span>
            </div>
            <button onClick={onLogout} className="btn-logout" title="Sair">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="container dashboard-main animate-fade-in">
        <div className="welcome-section">
          <h1>Treinamentos</h1>
          <p>Selecione um grupo de produtos para abrir a trilha de estudo.</p>
        </div>

        <div className="modules-grid">
          {modules.map((mod) => (
            <ProductCard key={mod.id} module={mod} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Trainings;
