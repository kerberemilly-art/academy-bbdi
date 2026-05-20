import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, CheckCircle, Lock, PlayCircle } from 'lucide-react';
import { modulesData } from '../data/modulesData';
import { getMarketingLevelStatus, getMarketingModuleProgress, getMarketingModuleStatus } from '../data/trainingPath';
import './ModuleDetail.css';

const ModuleDetail = ({ currentUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const moduleInfo = modulesData[id];
  const backPath = location.state?.backPath || '/dashboard';
  const moduleStatus = getMarketingModuleStatus(currentUser, id);
  const moduleProgress = getMarketingModuleProgress(currentUser?.id, id);

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

  if (currentUser?.role !== 'master' && moduleStatus.isLocked) {
    const requiredModuleTitle = moduleStatus.requiredModuleId
      ? modulesData[moduleStatus.requiredModuleId]?.title
      : 'o módulo anterior';

    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Você ainda não tem acesso a este módulo.</h2>
        <p style={{ marginTop: '12px' }}>
          Conclua {requiredModuleTitle} para liberar {moduleInfo.title}.
        </p>
        <button className="btn-primary" onClick={() => navigate(backPath)} style={{ marginTop: '20px' }}>
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="module-detail-wrapper animate-fade-in">
      <header className="detail-header glass-panel" style={{ borderBottomColor: moduleInfo.color }}>
        <div className="container header-content">
          <button className="btn-back" onClick={() => navigate(backPath)}>
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

        <section className="module-progress glass-panel">
          <div className="module-progress-header">
            <div>
              <span className="section-kicker">Progresso do módulo</span>
              <h3>{moduleProgress}% concluído</h3>
            </div>
            <strong>
              {moduleInfo.levels.filter((level) => getMarketingLevelStatus(currentUser, id, level.id).isCompleted).length}
              /
              {moduleInfo.levels.length}
              {' '}
              níveis
            </strong>
          </div>
          <div className="module-progress-track">
            <span style={{ width: `${moduleProgress}%`, backgroundColor: moduleInfo.color }} />
          </div>
        </section>

        <div className="levels-grid">
          {moduleInfo.levels.map((level) => (
            <div key={level.id} className="level-card glass-panel">
              {(() => {
                const levelStatus = getMarketingLevelStatus(currentUser, id, level.id);
                return (
                  <div className="level-status">
                    {levelStatus.isCompleted ? (
                      <CheckCircle size={18} color="var(--success-color)" />
                    ) : levelStatus.isLocked ? (
                      <Lock size={18} color="var(--text-secondary)" />
                    ) : (
                      <PlayCircle size={18} color={moduleInfo.color} />
                    )}
                    <span>
                      {levelStatus.isCompleted
                        ? 'Concluído'
                        : levelStatus.isLocked
                          ? 'Bloqueado'
                          : 'Disponível'}
                    </span>
                  </div>
                );
              })()}
              <div className="level-info">
                <h3>Nível {level.title}</h3>
                <p>{level.description}</p>
              </div>
              {(() => {
                const levelStatus = getMarketingLevelStatus(currentUser, id, level.id);

                return (
                  <button 
                    className="btn-start"
                    style={{ backgroundColor: moduleInfo.color }}
                    onClick={() => navigate(`/lesson/${id}/${level.id}`, { state: { backPath } })}
                    disabled={!level.lesson || (currentUser?.role !== 'master' && levelStatus.isLocked)}
                  >
                    {level.lesson
                      ? currentUser?.role !== 'master' && levelStatus.isLocked
                        ? `Bloqueado até ${
                            levelStatus.requiredLevelId
                              ? modulesData[levelStatus.requiredModuleId]?.levels.find((item) => item.id === levelStatus.requiredLevelId)?.title
                              : modulesData[levelStatus.requiredModuleId]?.title
                          }`
                        : levelStatus.isCompleted
                          ? 'Revisar conteúdo'
                          : 'Iniciar Aprendizado'
                      : 'Em breve'}
                  </button>
                );
              })()}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ModuleDetail;
