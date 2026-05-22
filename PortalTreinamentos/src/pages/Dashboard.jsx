import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  CheckCircle,
  ClipboardCheck,
  Clock3,
  FileText,
  LogOut,
  Sparkles,
  Target,
  Users,
  Layout,
  Trophy,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SectorCard from '../components/SectorCard';
import StudyMentor from '../components/StudyMentor';
import { getSectorSummaries } from '../data/trainingCatalog';
import { canAccessAdminArea, canAccessSector } from '../data/sectorAccess';
import { fetchTrainings } from '../api/trainingAdminApi';
import {
  buildMentorContext,
  getCollaboratorStats,
  getDonutData,
  getMasterProgress,
  getRecentActivity,
  getUserProgressSummary,
} from '../data/dashboardMetrics';
import './Dashboard.css';

const Dashboard = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const displayName = currentUser.name?.trim() || 'Usuário';
  const sectors = getSectorSummaries();
  const [trainings, setTrainings] = useState([]);
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const circumference = 2 * Math.PI * 50; // 314.159

  const isMaster = currentUser.role === 'master';
  const isAdmin = currentUser.role === 'admin';
  const isAnyAdmin = isMaster || isAdmin;

  const visibleSectors = isMaster
    ? sectors
    : sectors.filter((sector) => canAccessSector(currentUser, sector.id));

  const userProgress = useMemo(
    () => getUserProgressSummary(currentUser, sectors, isAnyAdmin),
    [currentUser, sectors, isAnyAdmin],
  );

  const collaboratorStats = useMemo(
    () => getCollaboratorStats(currentUser, visibleSectors, isAnyAdmin),
    [currentUser, visibleSectors, isAnyAdmin],
  );

  const donutData = useMemo(
    () => getDonutData(currentUser, visibleSectors, isAnyAdmin),
    [currentUser, visibleSectors, isAnyAdmin],
  );

  const masterProgress = useMemo(
    () => getMasterProgress(currentUser, sectors, isAdmin),
    [currentUser, sectors, isAdmin],
  );

  const mentorContext = useMemo(
    () => buildMentorContext({
      isMaster,
      isAdmin,
      displayName,
      visibleSectors,
      masterProgress,
      userProgress,
      collaboratorStats,
    }),
    [collaboratorStats, displayName, isAdmin, isMaster, masterProgress, userProgress, visibleSectors],
  );

  const recentActivity = useMemo(
    () => getRecentActivity(trainings, currentUser, sectors, isAdmin),
    [currentUser, isAdmin, sectors, trainings],
  );

  const activityIconMap = {
    training: FileText,
    user: Users,
    sector: Sparkles,
  };

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




  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <div className="header-content container">
          <div className="header-logo">
            <div className="bbdi-logo-mark">
              <span className="bbdi-logo-bb">BBDI</span>
              <span className="bbdi-logo-academy">ACADEMY</span>
            </div>
          </div>
          <div className="header-actions">
            <div className="user-profile">
              <div className="avatar">{displayName.charAt(0).toUpperCase()}</div>
              <span>{displayName}</span>
            </div>
            {canAccessAdminArea(currentUser) && (
              <>
                <button
                  onClick={() => navigate('/admin/trainings')}
                  className="btn-users"
                  title="Gerenciar treinamentos"
                >
                  <FileText size={20} />
                </button>
                <button
                  onClick={() => navigate('/admin/progress')}
                  className="btn-users"
                  title="Acompanhar progresso"
                >
                  <BarChart3 size={20} />
                </button>
                <button
                  onClick={() => navigate('/admin/users')}
                  className="btn-users"
                  title="Gerenciar usuários"
                >
                  <Users size={20} />
                </button>
              </>
            )}
            <button onClick={onLogout} className="btn-logout" title="Sair">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="container dashboard-main animate-fade-in">
        {isAnyAdmin ? (
          <>
            <section className="hero-panel">
              <div className="hero-copy">
                <span className="section-kicker">
                  <Zap size={14} />
                  Visão Master do Sistema
                </span>
                <h1>Olá, {displayName}!</h1>
                <p>
                  Acompanhe em tempo real a evolução dos departamentos e o desempenho técnico de toda a equipe em um único painel.
                </p>
                <div className="hero-actions">
                  <button className="btn-primary" onClick={() => navigate('/admin/trainings')}>
                    <BookOpen size={18} />
                    Gestão Técnica
                  </button>
                  <button className="btn-highlight" onClick={() => navigate('/admin/users')}>
                    <Users size={18} />
                    Usuários
                  </button>
                </div>
              </div>
              <div className="hero-surface">
                <div className="hero-surface-card">
                  <Layout size={24} />
                  <strong>{sectors.length}</strong>
                  <span>Setores</span>
                </div>
                <div className="hero-surface-card accent">
                  <Trophy size={24} />
                  <strong>{masterProgress.averageScore}%</strong>
                  <span>Média Geral</span>
                </div>
              </div>
            </section>

            <section className="dashboard-quick-links">
              <div className="panel-heading spaced">
                <h2>Atalhos de Gestão</h2>
              </div>
              <div className="quick-links-grid">
                <button className="quick-link-card" onClick={() => navigate('/admin/trainings')}>
                  <div className="activity-icon">
                    <FileText size={24} />
                  </div>
                  <span>
                    <strong>Gerenciar treinamentos</strong>
                    <small>Criação e curadoria de conteúdos técnicos</small>
                  </span>
                  <ArrowRight size={20} color="var(--accent-color)" />
                </button>
                <button className="quick-link-card" onClick={() => navigate('/admin/users')}>
                   <div className="activity-icon">
                    <Users size={24} />
                  </div>
                  <span>
                    <strong>Gerenciar usuários</strong>
                    <small>Controle de acessos e permissões de equipe</small>
                  </span>
                  <ArrowRight size={20} color="var(--accent-color)" />
                </button>
                <button className="quick-link-card" onClick={() => navigate('/admin/progress')}>
                   <div className="activity-icon">
                    <BarChart3 size={24} />
                  </div>
                  <span>
                    <strong>Monitorar progresso</strong>
                    <small>Análise detalhada de evolução por setor</small>
                  </span>
                  <ArrowRight size={20} color="var(--accent-color)" />
                </button>
              </div>
            </section>

            <section className="dashboard-activity">
              <div className="panel-heading">
                <h2>Últimas Atividades</h2>
              </div>
              <div className="activity-grid">
                {recentActivity.map((item) => {
                  const Icon = activityIconMap[item.iconKey] ?? FileText;
                  return (
                    <article key={item.id} className="activity-card">
                      <div className="activity-icon">
                        <Icon size={20} />
                      </div>
                      <div>
                        <strong>{item.title}</strong>
                        <p>{item.subtitle}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="master-home-grid">
              <div className="departments-panel">
                <div className="panel-heading spaced">
                  <h2>Catálogo de Departamentos</h2>
                  <button className="btn-outline" onClick={() => navigate('/trainings')} style={{ padding: '8px 20px' }}>
                    Ver Todos
                  </button>
                </div>

                <div className="departments-grid">
                  {visibleSectors.map((sector) => (
                    <SectorCard key={sector.id} sector={sector} currentUser={currentUser} />
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : (
          <>
            <section className="hero-panel">
              <div className="hero-copy">
                <span className="section-kicker" style={{ gap: '12px', marginBottom: '24px' }}>
                  <Target size={16} style={{ marginRight: '8px' }} />
                  <span>Sua Jornada Técnica</span>
                </span>
                <h1>Olá, {displayName}!</h1>
                <p>
                  Continue sua capacitação. Seu progresso técnico e certificações estão centralizados aqui.
                </p>
                <div className="hero-actions">
                  <button className="btn-primary" onClick={() => navigate('/trainings')}>
                    <BookOpen size={18} />
                    Continuar Trilha
                  </button>
                  <button className="btn-highlight" onClick={() => navigate('/certificate')}>
                    <Award size={18} />
                    Ver Certificado
                  </button>
                </div>
              </div>
              <div className="hero-surface">
                <div className="hero-surface-card">
                  <Sparkles size={24} />
                  <strong>{userProgress.progressPercent}%</strong>
                  <span>Concluído</span>
                </div>
                <div className="hero-surface-card accent">
                  <Clock3 size={24} />
                  <strong>{userProgress.remainingSteps}</strong>
                  <span>Etapas</span>
                </div>
              </div>
            </section>

            {/* Analytics Section remains identical in logic but benefits from global style refactor */}
            <section className="learning-analytics-section glass-panel">
              <div className="panel-heading">
                <BarChart3 size={24} color="var(--accent-color)" />
                <h2>Métricas de Aprendizado</h2>
              </div>
              
              <div className="collaborator-stats-grid">
                <div className="stat-card glass-card">
                  <div className="stat-icon-wrapper blue">
                    <ClipboardCheck size={20} />
                  </div>
                  <div className="stat-info">
                    <strong>{collaboratorStats.completedCount}</strong>
                    <span>Quizzes</span>
                  </div>
                </div>
                
                <div className="stat-card glass-card">
                  <div className="stat-icon-wrapper green">
                    <Target size={20} />
                  </div>
                  <div className="stat-info">
                    <strong>{collaboratorStats.averageScore}%</strong>
                    <span>Média</span>
                  </div>
                </div>
                
                <div className="stat-card glass-card">
                  <div className="stat-icon-wrapper purple">
                    <Clock3 size={20} />
                  </div>
                  <div className="stat-info">
                    <strong>{collaboratorStats.formattedStudyTime}</strong>
                    <span>Estudo</span>
                  </div>
                </div>
                
                <div className="stat-card glass-card">
                  <div className="stat-icon-wrapper orange">
                    <Award size={20} />
                  </div>
                  <div className="stat-info">
                    <strong>{collaboratorStats.certificatesCount}</strong>
                    <span>Certificados</span>
                  </div>
                </div>
              </div>

              <div className="analytics-details-layout">
                <div className="analytics-left-panel">
                  <div className="progress-header-row">
                    <div>
                      <span className="stat-label">Status da Trilha</span>
                      <h3>{userProgress.progressPercent}% Finalizado</h3>
                    </div>
                  </div>
                  <div className="training-progress-track">
                    <span style={{ width: `${userProgress.progressPercent}%` }} />
                  </div>
                  <div className="next-step-box">
                    <Zap size={18} color="var(--accent-color)" />
                    <div>
                      <strong>Próxima Meta:</strong>
                      <p>{userProgress.nextStepText}</p>
                    </div>
                  </div>
                </div>

                <div className="analytics-right-panel">
                   <div className="donut-chart-container">
                    <svg width="140" height="140" viewBox="0 0 120 120" className="donut-svg">
                      <circle cx="60" cy="60" r="50" fill="transparent" stroke="var(--bg-primary)" strokeWidth="12" />
                      {(() => {
                        let accumulatedAngle = -90;
                        return donutData.segments.map((segment) => {
                          const angle = (segment.percentageOfTotal / 100) * 360;
                          const strokeDashoffset = circumference - (circumference * segment.percentageOfTotal) / 100;
                          const currentAngle = accumulatedAngle;
                          accumulatedAngle += angle;
                          const isActive = hoveredSegment?.id === segment.id;
                          return (
                            <circle
                              key={segment.id}
                              cx="60"
                              cy="60"
                              r="50"
                              fill="transparent"
                              stroke={segment.color}
                              strokeWidth={isActive ? 16 : 12}
                              strokeDasharray={`${circumference} ${circumference}`}
                              strokeDashoffset={strokeDashoffset}
                              transform={`rotate(${currentAngle} 60 60)`}
                              onMouseEnter={() => setHoveredSegment(segment)}
                              onMouseLeave={() => setHoveredSegment(null)}
                              style={{ transition: 'all 0.3s ease' }}
                            />
                          );
                        });
                      })()}
                      <g className="donut-center-text">
                        <text x="60" y="65" textAnchor="middle" style={{ fontSize: '1.2rem', fontWeight: 900, fill: 'var(--accent-color)' }}>
                          {hoveredSegment ? `${hoveredSegment.percent}%` : `${userProgress.progressPercent}%`}
                        </text>
                      </g>
                    </svg>

                    <div className="donut-legend">
                      {donutData.segments.map((segment) => (
                        <div key={segment.id} className="donut-legend-item">
                          <span className="donut-legend-color" style={{ backgroundColor: segment.color }} />
                          <span className="legend-title">{segment.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="panel-heading" style={{ marginTop: '48px' }}>
              <h2>Meus Departamentos</h2>
            </div>
            <div className="departments-grid">
              {visibleSectors.map((sector) => (
                <SectorCard key={sector.id} sector={sector} currentUser={currentUser} />
              ))}
            </div>
          </>
        )}
      </main>
      <StudyMentor lessonContent={mentorContext} />
    </div>
  );
};

export default Dashboard;
