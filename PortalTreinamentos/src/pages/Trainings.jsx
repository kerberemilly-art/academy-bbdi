import { ArrowLeft, BookOpen, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SectorCard from '../components/SectorCard';
import { getSectorSummaries } from '../data/trainingCatalog';
import { canAccessSector } from '../data/sectorAccess';
import './Dashboard.css';

const Trainings = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const displayName = currentUser.name?.trim() || 'Usuário';
  const sectors = getSectorSummaries().filter((sector) => canAccessSector(currentUser, sector.id));

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header glass-panel">
        <div className="header-content container">
          <div className="header-logo">
            <button className="btn-back compact" onClick={() => navigate('/dashboard')}>
              <ArrowLeft size={20} />
              <span>Voltar</span>
            </button>
            <div className="bbdi-logo-mark header-logo-mark">
              <span className="bbdi-logo-bb">BBDI</span>
              <span className="bbdi-logo-divider">|</span>
              <span className="bbdi-logo-academy">ACADEMY</span>
            </div>
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
          <h1>Setores de treinamento</h1>
          <p>Selecione um setor para abrir a trilha de estudo correspondente.</p>
        </div>

        <div className="modules-grid">
          {sectors.map((sector) => (
            <SectorCard key={sector.id} sector={sector} currentUser={currentUser} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Trainings;
