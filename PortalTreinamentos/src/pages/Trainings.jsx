import { ArrowLeft, BookOpen, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTrainings } from '../api/trainingAdminApi';
import SectorCard from '../components/SectorCard';
import { getSectorSummaries } from '../data/trainingCatalog';
import { useVisibleSectorsWithStats } from '../data/trainingStats';
import './Dashboard.css';

const Trainings = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const displayName = currentUser.name?.trim() || 'Usuário';
  const [trainings, setTrainings] = useState([]);

  useEffect(() => {
    let cancelled = false;

    fetchTrainings()
      .then((items) => {
        if (!cancelled) {
          setTrainings(items);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTrainings([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const sectors = useVisibleSectorsWithStats(currentUser, getSectorSummaries(), trainings);

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <div className="header-content container">
          <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button className="btn-back" onClick={() => navigate('/dashboard')} title="Voltar ao Dashboard">
              <ArrowLeft size={20} />
            </button>
            <div className="bbdi-logo-mark header-logo-mark">
              <span className="bbdi-logo-bb">BBDI</span>
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
        <section className="hero-panel" style={{ padding: '32px 40px', gridTemplateColumns: '1fr' }}>
           <div className="hero-copy">
              <span className="section-kicker">Catálogo Técnico</span>
              <h1 style={{ fontSize: '1.8rem' }}>Setores de Capacitação</h1>
              <p style={{ marginBottom: 0 }}>
                Explore os departamentos e inicie os treinamentos técnicos especializados do Grupo BBDI.
              </p>
           </div>
        </section>

        <div className="panel-heading">
          <BookOpen size={20} color="var(--accent-color)" />
          <h2>Departamentos Disponíveis</h2>
        </div>

        <div className="modules-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {sectors.map((sector) => (
            <SectorCard key={sector.id} sector={sector} currentUser={currentUser} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Trainings;
