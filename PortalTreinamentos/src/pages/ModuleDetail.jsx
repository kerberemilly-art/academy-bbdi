import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { modulesData } from '../data/modulesData';
import './ModuleDetail.css';

const ModuleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const moduleInfo = modulesData[id];

  if (!moduleInfo) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Módulo não encontrado ou em desenvolvimento.</h2>
        <button className="btn-primary" onClick={() => navigate('/dashboard')} style={{ marginTop: '20px' }}>
          Voltar ao Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="module-detail-wrapper animate-fade-in">
      <header className="detail-header glass-panel" style={{ borderBottomColor: moduleInfo.color }}>
        <div className="container header-content">
          <button className="btn-back" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={24} />
            <span>Voltar</span>
          </button>
          <div className="header-title">
            <BookOpen size={28} color={moduleInfo.color} />
            <h2>Trilha: {moduleInfo.title}</h2>
          </div>
        </div>
      </header>

      <main className="container detail-main">
        <div className="module-intro">
          <p>{moduleInfo.description}</p>
        </div>

        <div className="levels-grid">
          {moduleInfo.levels.map((level) => (
            <div key={level.id} className="level-card glass-panel">
              <div className="level-info">
                <h3>Nível {level.title}</h3>
                <p>{level.description}</p>
              </div>
              <button 
                className="btn-start"
                style={{ backgroundColor: moduleInfo.color }}
                onClick={() => navigate(`/lesson/${id}/${level.id}`)}
                disabled={!level.lesson}
              >
                {level.lesson ? 'Iniciar Aprendizado' : 'Em breve'}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ModuleDetail;
