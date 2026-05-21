import { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, CheckCircle, Lock, PlayCircle } from 'lucide-react';
import { modulesData } from '../data/modulesData';
import { sectorsData } from '../data/sectorsData';
import { getMarketingLevelStatus, getMarketingModuleProgress, getMarketingModuleStatus } from '../data/trainingPath';
import { fetchTrainings, getCachedTrainings } from '../data/trainingAdminApi';
import './ModuleDetail.css';

const ModuleDetail = ({ currentUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const backPath = location.state?.backPath || '/dashboard';
  const [customTrainings, setCustomTrainings] = useState(() => getCachedTrainings());

  useEffect(() => {
    let cancelled = false;

    fetchTrainings()
      .then((items) => {
        if (!cancelled) {
          setCustomTrainings(items);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  let moduleInfo = modulesData[id];
  if (!moduleInfo) {
    const matchedTraining = customTrainings.find(
      (t) => String(t.moduleId).trim().toLowerCase() === String(id).trim().toLowerCase()
    );
    if (matchedTraining) {
      const sector = sectorsData.find((s) => s.id === matchedTraining.departmentId);
      moduleInfo = {
        id: matchedTraining.moduleId,
        title: matchedTraining.moduleId,
        description: matchedTraining.description || 'Treinamento personalizado criado por Administrador.',
        color: sector?.color || '#3b82f6',
        levels: [
          { id: 'basico', title: 'Básico', description: 'Conceitos introdutórios e termos fundamentais.' },
          { id: 'intermediario', title: 'Intermediário', description: 'Processos avançados e uso prático.' },
          { id: 'avancado', title: 'Avançado', description: 'Análise crítica e liderança.' }
        ]
      };
    }
  }

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

  if (currentUser?.role !== 'master' && currentUser?.role !== 'admin' && moduleStatus.isLocked) {
    const requiredModuleTitle = moduleStatus.requiredModuleId
      ? (modulesData[moduleStatus.requiredModuleId]?.title || moduleStatus.requiredModuleId)
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

        <div className="roadmap-container">
          {/* Neon SVG Path Background */}
          <svg className="roadmap-svg-line" viewBox="0 0 800 540" preserveAspectRatio="none">
            <defs>
              <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            {/* Curved connections centered at Node 1 (360, 90) -> Node 2 (400, 270) -> Node 3 (440, 450) */}
            <path
              d="M 360 90 Q 420 180 400 270"
              fill="none"
              stroke={
                moduleInfo.levels[1] && getMarketingLevelStatus(currentUser, id, moduleInfo.levels[1].id).isLocked
                  ? 'rgba(148, 163, 184, 0.2)'
                  : moduleInfo.color
              }
              strokeWidth="6"
              filter={
                moduleInfo.levels[1] && getMarketingLevelStatus(currentUser, id, moduleInfo.levels[1].id).isLocked
                  ? 'none'
                  : 'url(#neon-glow)'
              }
              style={{ transition: 'stroke 0.5s ease' }}
            />
            
            <path
              d="M 400 270 Q 380 360 440 450"
              fill="none"
              stroke={
                moduleInfo.levels[2] && getMarketingLevelStatus(currentUser, id, moduleInfo.levels[2].id).isLocked
                  ? 'rgba(148, 163, 184, 0.2)'
                  : moduleInfo.color
              }
              strokeWidth="6"
              filter={
                moduleInfo.levels[2] && getMarketingLevelStatus(currentUser, id, moduleInfo.levels[2].id).isLocked
                  ? 'none'
                  : 'url(#neon-glow)'
              }
              style={{ transition: 'stroke 0.5s ease' }}
            />
          </svg>

          {moduleInfo.levels.map((level, index) => {
            const levelStatus = getMarketingLevelStatus(currentUser, id, level.id);
            const customTraining = customTrainings.find(
              (t) => String(t.moduleId).trim().toLowerCase() === String(id).trim().toLowerCase() && t.level === level.id && t.status === 'published'
            );
            const hasLesson = Boolean(level.lesson || customTraining);
            
            const rowClass = `roadmap-row roadmap-row-${index + 1}`;
            const nodeLeftOffset = index === 0 ? '-40px' : index === 2 ? '40px' : '0px';

            const cardContent = (
              <div 
                className={`level-card glass-panel timeline-card ${levelStatus.isLocked ? 'locked-card' : ''}`}
                style={{ 
                  borderColor: !levelStatus.isLocked ? moduleInfo.color : 'rgba(148, 163, 184, 0.15)',
                  boxShadow: !levelStatus.isLocked ? `0 8px 32px rgba(15, 23, 42, 0.04), 0 0 12px ${moduleInfo.color}15` : 'none'
                }}
              >
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
                <div className="level-info">
                  <h3>Nível {level.title}</h3>
                  <p>{level.description}</p>
                </div>
                <button 
                  className="btn-start"
                  style={{ backgroundColor: moduleInfo.color }}
                  onClick={() => {
                    if (customTraining) {
                      navigate(`/training/${customTraining.id}`, { state: { backPath: `/module/${id}` } });
                    } else {
                      navigate(`/lesson/${id}/${level.id}`, { state: { backPath } });
                    }
                  }}
                  disabled={!hasLesson || (currentUser?.role !== 'master' && currentUser?.role !== 'admin' && levelStatus.isLocked)}
                >
                  {hasLesson
                    ? currentUser?.role !== 'master' && currentUser?.role !== 'admin' && levelStatus.isLocked
                      ? `Bloqueado`
                      : levelStatus.isCompleted
                        ? 'Revisar conteúdo'
                        : 'Iniciar Aprendizado'
                    : 'Em breve'}
                </button>
              </div>
            );

            return (
              <div key={level.id} className={rowClass}>
                {/* Left Column */}
                <div className="roadmap-col roadmap-left">
                  {index % 2 === 0 ? cardContent : null}
                </div>
                
                {/* Center Column */}
                <div className="roadmap-col roadmap-center">
                  <div
                    className={`node-circle-wrapper ${levelStatus.isLocked ? 'locked' : 'active'} ${levelStatus.isCompleted ? 'completed' : ''}`}
                    style={{
                      transform: `translateX(${nodeLeftOffset})`,
                      '--node-color': moduleInfo.color,
                    }}
                  >
                    <div className="node-circle" style={{ borderColor: !levelStatus.isLocked ? moduleInfo.color : 'var(--panel-border)' }}>
                      {levelStatus.isCompleted ? (
                        <CheckCircle size={28} color="var(--success-color)" className="check-anim" />
                      ) : levelStatus.isLocked ? (
                        <Lock size={24} className="lock-icon-anim" />
                      ) : (
                        <PlayCircle size={28} color={moduleInfo.color} className="play-icon-anim" />
                      )}
                    </div>
                    <span className="node-badge" style={{ backgroundColor: !levelStatus.isLocked ? moduleInfo.color : 'var(--text-secondary)' }}>
                      {index + 1}
                    </span>
                  </div>
                </div>
                
                {/* Right Column */}
                <div className="roadmap-col roadmap-right">
                  {index % 2 !== 0 ? cardContent : null}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default ModuleDetail;
