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
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SectorCard from '../components/SectorCard';
import { modulesData } from '../data/modulesData';
import { getSectorSummaries } from '../data/trainingCatalog';
import { getMarketingTrainingProgress } from '../data/trainingPath';
import { getLatestResultsByUser, getQuizResults, getTrainingTests } from '../data/progressStorage';
import { getUsers } from '../data/usersStorage';
import { canAccessAdminArea, canAccessSector, getUserDepartmentId, getUserDepartmentIds } from '../data/sectorAccess';
import { fetchTrainings } from '../data/trainingAdminApi';
import './Dashboard.css';

const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

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

  const userProgress = useMemo(() => {
    if (isAnyAdmin) return null;
    const userDeptId = getUserDepartmentId(currentUser) || 'marketing-produtos';
    const prog = getMarketingTrainingProgress(currentUser.id, userDeptId);
    const sector = sectors.find((s) => s.id === userDeptId);
    
    return {
      progressPercent: prog.progressPercent,
      completedSteps: prog.completedSteps,
      totalSteps: prog.totalSteps,
      remainingSteps: prog.remainingSteps,
      nextStepText: prog.nextStep
        ? `${modulesData[prog.nextStep.moduleId]?.title} - ${prog.nextStep.levelTitle}`
        : (prog.totalSteps === 0 ? 'Nenhum treinamento cadastrado' : 'Nenhum'),
      hasFinished: !prog.nextStep,
      deptTitle: sector?.title || userDeptId,
    };
  }, [currentUser, sectors, isAnyAdmin]);

  const collaboratorStats = useMemo(() => {
    if (isAnyAdmin) return null;
    const results = getQuizResults().filter((r) => r.userId === currentUser.id);
    const uniqueQuizzesCompleted = new Set(results.map((r) => `${r.moduleId}:${r.levelId}`));
    const completedCount = uniqueQuizzesCompleted.size;
    
    const latestResults = new Map();
    results.forEach((r) => {
      const key = `${r.moduleId}:${r.levelId}`;
      const prev = latestResults.get(key);
      if (!prev || new Date(r.submittedAt) > new Date(prev.submittedAt)) {
        latestResults.set(key, r);
      }
    });
    
    const totalScorePercent = Array.from(latestResults.values()).reduce((acc, curr) => acc + curr.percent, 0);
    const averageScore = latestResults.size > 0 ? Math.round(totalScorePercent / latestResults.size) : 0;
    
    // Each completed step is estimated to take ~15-20 minutes, plus 30 minutes for quiz
    const totalCompletedSteps = visibleSectors.reduce((sum, s) => {
      const prog = getMarketingTrainingProgress(currentUser.id, s.id);
      return sum + (prog.completedSteps || 0);
    }, 0);
    const estimatedHours = Math.max(0.2, parseFloat(((totalCompletedSteps * 15 + completedCount * 25) / 60).toFixed(1)));
    
    let certificatesCount = 0;
    visibleSectors.forEach((s) => {
      const prog = getMarketingTrainingProgress(currentUser.id, s.id);
      if (prog.totalSteps > 0 && prog.completedSteps === prog.totalSteps) {
        certificatesCount++;
      }
    });

    return {
      completedCount,
      averageScore,
      estimatedHours,
      certificatesCount,
    };
  }, [currentUser, visibleSectors, isAnyAdmin]);

  const donutData = useMemo(() => {
    if (isAnyAdmin) return null;
    const sectorsInfo = visibleSectors.map((sector) => {
      const prog = getMarketingTrainingProgress(currentUser.id, sector.id);
      return {
        id: sector.id,
        title: sector.title,
        color: sector.color || '#3b82f6',
        completed: prog.completedSteps || 0,
        percent: prog.progressPercent || 0,
      };
    });
    
    const totalCompleted = sectorsInfo.reduce((sum, s) => sum + s.completed, 0);
    
    if (totalCompleted === 0) {
      return {
        total: 0,
        segments: sectorsInfo.map((s) => ({
          ...s,
          percentageOfTotal: 100 / (sectorsInfo.length || 1),
        })),
        isEmpty: true,
      };
    }
    
    const segments = sectorsInfo.map((s) => ({
      ...s,
      percentageOfTotal: (s.completed / totalCompleted) * 100,
    }));
    
    return {
      total: totalCompleted,
      segments,
      isEmpty: false,
    };
  }, [currentUser, visibleSectors, isAnyAdmin]);

  const masterProgress = useMemo(() => {
    let users = getUsers().filter((user) => user.role !== 'master' && user.role !== 'admin');
    
    if (isAdmin) {
      const adminDeptIds = getUserDepartmentIds(currentUser);
      users = users.filter((u) => {
        const uDeptIds = getUserDepartmentIds(u);
        return uDeptIds.some((deptId) => adminDeptIds.includes(deptId));
      });
    }

    const activeUsers = users.filter((user) => user.active);
    
    let tests = getTrainingTests(modulesData);
    if (isAdmin) {
      const adminDeptIds = getUserDepartmentIds(currentUser);
      const allowedModuleIds = sectors
        .filter((sector) => adminDeptIds.includes(sector.id))
        .flatMap((sector) => sector.moduleIds ?? []);
      const allowedModuleIdsStr = allowedModuleIds.map(String);
      tests = tests.filter((test) => allowedModuleIdsStr.includes(String(test.moduleId)));
    }

    const results = getQuizResults();
    const latestResults = getLatestResultsByUser(results);
    const totalPossible = users.length * tests.length;
    const completed = users.reduce((sum, user) => (
      sum + tests.filter((test) => latestResults.has(`${user.id}:${test.moduleId}:${test.levelId}`)).length
    ), 0);
    const userSummaries = users.map((user) => {
      const userResults = tests
        .map((test) => latestResults.get(`${user.id}:${test.moduleId}:${test.levelId}`))
        .filter(Boolean);
      const average = userResults.length
        ? Math.round(userResults.reduce((sum, result) => sum + result.percent, 0) / userResults.length)
        : 0;
      const latestDate = userResults
        .map((result) => result.submittedAt)
        .sort((a, b) => new Date(b) - new Date(a))[0];

      return {
        user,
        completed: userResults.length,
        average,
        progress: tests.length ? Math.round((userResults.length / tests.length) * 100) : 0,
        latestDate,
      };
    });
    const averageScore = userSummaries.length
      ? Math.round(userSummaries.reduce((sum, summary) => sum + summary.average, 0) / userSummaries.length)
      : 0;

    return {
      activeUsers: activeUsers.length,
      tests: tests.length,
      completion: totalPossible ? Math.round((completed / totalPossible) * 100) : 0,
      averageScore,
      userSummaries: userSummaries.slice(0, 5),
    };
  }, [currentUser, sectors, isAdmin]);

  const recentActivity = useMemo(() => {
    const latestTraining = [...trainings]
      .sort((a, b) => new Date(b.updatedAt ?? b.createdAt ?? 0) - new Date(a.updatedAt ?? a.createdAt ?? 0))[0];
    
    let users = getUsers().filter((user) => user.role !== 'master' && user.role !== 'admin');
    if (isAdmin) {
      const adminDeptIds = getUserDepartmentIds(currentUser);
      users = users.filter((u) => {
        const uDeptIds = getUserDepartmentIds(u);
        return uDeptIds.some((deptId) => adminDeptIds.includes(deptId));
      });
    }

    const recentCollaborator = [...users]
      .sort((a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0))[0];
    const highlightedSector = sectors.find((sector) => sector.status === 'active') ?? sectors[0] ?? null;

    return [
      {
        id: 'latest-training',
        icon: FileText,
        title: latestTraining ? latestTraining.title : 'Nenhum treinamento cadastrado',
        subtitle: latestTraining
          ? `Atualizado em ${dateTimeFormatter.format(new Date(latestTraining.updatedAt ?? latestTraining.createdAt))}`
          : 'Ainda não há conteúdo publicado',
      },
      {
        id: 'recent-user',
        icon: Users,
        title: recentCollaborator ? recentCollaborator.name : 'Nenhum colaborador recente',
        subtitle: recentCollaborator
          ? `Cadastrado em ${dateFormatter.format(new Date(recentCollaborator.createdAt))}`
          : 'Sem movimentação de usuários',
      },
      {
        id: 'sector',
        icon: Sparkles,
        title: highlightedSector ? highlightedSector.title : 'Nenhum departamento',
        subtitle: highlightedSector ? highlightedSector.description : 'Sem departamentos configurados',
      },
    ];
  }, [sectors, trainings, currentUser, isAdmin]);

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

  const formatDate = (date) => {
    if (!date) return 'Sem atividade';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };



  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header glass-panel">
        <div className="header-content container">
          <div className="header-logo">
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
            {canAccessAdminArea(currentUser) && (
              <>
                <button
                  onClick={() => navigate('/admin/trainings')}
                  className="btn-users"
                  title="Gerenciar treinamentos"
                >
                  <FileText size={20} />
                  <span>Treinamentos</span>
                </button>
                <button
                  onClick={() => navigate('/admin/progress')}
                  className="btn-users"
                  title="Acompanhar progresso"
                >
                  <BarChart3 size={20} />
                  <span>Progresso</span>
                </button>
                <button
                  onClick={() => navigate('/admin/users')}
                  className="btn-users"
                  title="Gerenciar usuários"
                >
                  <Users size={20} />
                  <span>Usuários</span>
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
            <section className="hero-panel glass-panel master-hero">
              <div className="hero-copy">
                <span className="section-kicker">Visão geral</span>
                <h1>Olá, {displayName}! 👋</h1>
                <p>
                  Acompanhe departamentos, treinamentos e a movimentação dos colaboradores em um painel único.
                </p>
                <div className="hero-actions">
                  <button className="btn-primary" onClick={() => navigate('/admin/trainings')}>
                    <BookOpen size={18} />
                    Treinamentos
                  </button>
                  <button className="btn-outline" onClick={() => navigate('/admin/users')}>
                    <Users size={18} />
                    Usuários
                  </button>
                  <button className="btn-outline" onClick={() => navigate('/admin/progress')}>
                    <BarChart3 size={18} />
                    Progresso
                  </button>
                </div>
              </div>
              <div className="hero-surface">
                <div className="hero-surface-card">
                  <ShieldCheck size={22} />
                  <strong>{sectors.length}</strong>
                  <span>departamentos</span>
                </div>
                <div className="hero-surface-card accent">
                  <Award size={22} />
                  <strong>{masterProgress.averageScore}%</strong>
                  <span>média geral</span>
                </div>
              </div>
            </section>

            <section className="dashboard-quick-links glass-panel">
              <div className="panel-heading spaced compact">
                <div>
                  <span className="section-kicker">Acesso rápido</span>
                  <h2>Atalhos principais</h2>
                </div>
              </div>
              <div className="quick-links-grid">
                <button className="quick-link-card" onClick={() => navigate('/admin/trainings')}>
                  <FileText size={20} />
                  <span>
                    <strong>Gerenciar treinamentos</strong>
                    <small>Criar e organizar conteúdos</small>
                  </span>
                  <ArrowRight size={18} />
                </button>
                <button className="quick-link-card" onClick={() => navigate('/admin/users')}>
                  <Users size={20} />
                  <span>
                    <strong>Gerenciar usuários</strong>
                    <small>Delegar admins e colaboradores</small>
                  </span>
                  <ArrowRight size={18} />
                </button>
                <button className="quick-link-card" onClick={() => navigate('/admin/progress')}>
                  <BarChart3 size={20} />
                  <span>
                    <strong>Ver progresso</strong>
                    <small>Monitorar o avanço da equipe</small>
                  </span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </section>

            <section className="dashboard-activity glass-panel">
              <div className="panel-heading spaced compact">
                <div>
                  <span className="section-kicker">Atividade recente</span>
                  <h2>Últimos movimentos</h2>
                </div>
                <span className="activity-note">Atualizado automaticamente</span>
              </div>
              <div className="activity-grid">
                {recentActivity.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article key={item.id} className="activity-card">
                      <div className="activity-icon">
                        <Icon size={18} />
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
              <div className="departments-panel glass-panel">
                <div className="panel-heading spaced">
                  <div>
                    <span className="section-kicker">Departamentos</span>
                    <h2>Áreas de treinamento</h2>
                  </div>
                  <button className="btn-users" onClick={() => navigate('/trainings')}>
                    <BookOpen size={18} />
                    <span>Abrir todos</span>
                  </button>
                </div>

                <div className="departments-grid">
                  {visibleSectors.map((sector) => (
                    <SectorCard key={sector.id} sector={sector} currentUser={currentUser} />
                  ))}
                </div>
              </div>
            </section>

            <section className="master-progress-panel glass-panel">
              <div className="panel-heading">
                <BarChart3 size={24} color="var(--accent-color)" />
                <h2>Progresso dos colaboradores</h2>
              </div>
              <div className="master-metrics">
                <div>
                  <Users size={22} />
                  <strong>{masterProgress.activeUsers}</strong>
                  <span>ativos</span>
                </div>
                <div>
                  <ClipboardCheck size={22} />
                  <strong>{masterProgress.tests}</strong>
                  <span>testes</span>
                </div>
                <div>
                  <CheckCircle size={22} />
                  <strong>{masterProgress.completion}%</strong>
                  <span>conclusão</span>
                </div>
                <div>
                  <Target size={22} />
                  <strong>{masterProgress.averageScore}%</strong>
                  <span>média</span>
                </div>
              </div>
            </section>

            <section className="master-collaborators glass-panel">
              <div className="panel-heading spaced">
                <div>
                  <span className="section-kicker">Resumo</span>
                  <h2>Último status dos colaboradores</h2>
                </div>
                <button className="btn-users" onClick={() => navigate('/admin/users')}>
                  <Users size={18} />
                  <span>Gerenciar usuários</span>
                </button>
              </div>

              <div className="master-collaborator-list">
                {masterProgress.userSummaries.map((summary) => (
                  <div key={summary.user.id} className="master-collaborator-row">
                    <div className="collaborator-name">
                      <div className="avatar small">{summary.user.name.charAt(0).toUpperCase()}</div>
                      <div>
                        <strong>{summary.user.name}</strong>
                        <span>{summary.user.email}</span>
                      </div>
                    </div>
                    <div className="collaborator-progress-bar">
                      <span style={{ width: `${summary.progress}%` }} />
                    </div>
                    <strong>{summary.completed}/{masterProgress.tests}</strong>
                    <span>{summary.average}% média</span>
                    <span>{formatDate(summary.latestDate)}</span>
                  </div>
                ))}

                {!masterProgress.userSummaries.length && (
                  <div className="empty-master-state">Nenhum colaborador cadastrado ainda.</div>
                )}
              </div>
            </section>
          </>
        ) : (
          <>
            <section className="hero-panel glass-panel collaborator-hero">
              <div className="hero-copy">
                <span className="section-kicker">Sua trilha</span>
                <h1>Olá, {displayName}! 👋</h1>
                <p>
                  Continue de onde parou. Sua trilha e seu certificado estão sempre a um clique.
                </p>
                <div className="hero-actions">
                  <button className="btn-primary" onClick={() => navigate('/trainings')}>
                    <BookOpen size={18} />
                    Continuar trilha
                  </button>
                  <button className="btn-outline" onClick={() => navigate('/certificate')}>
                    <Award size={18} />
                    Ver certificado
                  </button>
                </div>
              </div>
              <div className="hero-surface">
                <div className="hero-surface-card">
                  <Sparkles size={22} />
                  <strong>{userProgress.progressPercent}%</strong>
                  <span>concluído</span>
                </div>
                <div className="hero-surface-card accent">
                  <Clock3 size={22} />
                  <strong>{userProgress.remainingSteps}</strong>
                  <span>etapas restantes</span>
                </div>
              </div>
            </section>

            {/* NOVO: Painel Analytics de Aprendizado Premium */}
            <section className="learning-analytics-section glass-panel">
              <div className="panel-heading">
                <BarChart3 size={24} color="var(--accent-color)" />
                <h2>Analytics de Aprendizado</h2>
              </div>
              
              <div className="collaborator-stats-grid">
                <div className="stat-card glass-card">
                  <div className="stat-icon-wrapper blue">
                    <ClipboardCheck size={20} />
                  </div>
                  <div className="stat-info">
                    <strong>{collaboratorStats.completedCount}</strong>
                    <span>Quizzes Feitos</span>
                  </div>
                </div>
                
                <div className="stat-card glass-card">
                  <div className="stat-icon-wrapper green">
                    <Target size={20} />
                  </div>
                  <div className="stat-info">
                    <strong>{collaboratorStats.averageScore}%</strong>
                    <span>Média de Acertos</span>
                  </div>
                </div>
                
                <div className="stat-card glass-card">
                  <div className="stat-icon-wrapper purple">
                    <Clock3 size={20} />
                  </div>
                  <div className="stat-info">
                    <strong>{collaboratorStats.estimatedHours}h</strong>
                    <span>Tempo de Estudo</span>
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
                {/* Lado Esquerdo: Progresso Geral e Próxima Etapa */}
                <div className="analytics-left-panel">
                  <div className="progress-header-row">
                    <div>
                      <span className="stat-label">Progresso Geral</span>
                      <h3>{userProgress.progressPercent}% Concluído</h3>
                    </div>
                    <div className="progress-counts">
                      <strong>{userProgress.completedSteps}/{userProgress.totalSteps}</strong>
                      <span>etapas finalizadas</span>
                    </div>
                  </div>
                  
                  <div className="training-progress-track" aria-label="Progresso do treinamento">
                    <span style={{ width: `${userProgress.progressPercent}%` }} />
                  </div>
                  
                  <div className="next-step-box glass-card">
                    <Sparkles size={16} color="var(--accent-color)" className="pulse-animation" />
                    <div>
                      <strong>Próximo Conteúdo:</strong>
                      <p>{userProgress.nextStepText}</p>
                    </div>
                  </div>
                </div>

                {/* Lado Direito: Donut Chart SVG Interativo */}
                <div className="analytics-right-panel">
                  <span className="stat-label">Progresso por Setor</span>
                  
                  <div className="donut-chart-container">
                    <svg width="140" height="140" viewBox="0 0 120 120" className="donut-svg">
                      {/* Background base circle */}
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="transparent"
                        stroke="rgba(148, 163, 184, 0.1)"
                        strokeWidth="12"
                      />
                      
                      {/* Dynamic segments */}
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
                              className="donut-segment"
                              style={{
                                '--segment-color': segment.color,
                                strokeWidth: isActive ? '16px' : '12px',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              }}
                              onMouseEnter={() => setHoveredSegment(segment)}
                              onMouseLeave={() => setHoveredSegment(null)}
                            />
                          );
                        });
                      })()}
                      
                      {/* Text in the center */}
                      <g className="donut-center-text">
                        <text x="60" y="55" className="donut-center-title">
                          {hoveredSegment ? hoveredSegment.title.slice(0, 10) + '...' : 'GERAL'}
                        </text>
                        <text x="60" y="72" className="donut-center-value">
                          {hoveredSegment
                            ? `${hoveredSegment.percent}%`
                            : `${userProgress.progressPercent}%`}
                        </text>
                      </g>
                    </svg>

                    <div className="donut-legend">
                      {donutData.segments.map((segment) => (
                        <div
                          key={segment.id}
                          className={`donut-legend-item ${hoveredSegment?.id === segment.id ? 'active' : ''}`}
                          onMouseEnter={() => setHoveredSegment(segment)}
                          onMouseLeave={() => setHoveredSegment(null)}
                        >
                          <span
                            className="donut-legend-color"
                            style={{ backgroundColor: segment.color }}
                          />
                          <div className="legend-info">
                            <span className="legend-title">{segment.title}</span>
                            <span className="legend-percentage">{segment.percent}% concluído</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="dashboard-quick-links glass-panel">
              <div className="panel-heading spaced compact">
                <div>
                  <span className="section-kicker">Acesso rápido</span>
                  <h2>Próximas ações</h2>
                </div>
              </div>
              <div className="quick-links-grid compact">
                <button className="quick-link-card" onClick={() => navigate('/trainings')}>
                  <BookOpen size={20} />
                  <span>
                    <strong>Continuar estudo</strong>
                    <small>Abra sua trilha atual</small>
                  </span>
                  <ArrowRight size={18} />
                </button>
                <button className="quick-link-card" onClick={() => navigate('/certificate')}>
                  <Award size={20} />
                  <span>
                    <strong>Emitir certificado</strong>
                    <small>Ver sua conclusão final</small>
                  </span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </section>

            <section className="dashboard-activity glass-panel">
              <div className="panel-heading spaced compact">
                <div>
                  <span className="section-kicker">Resumo</span>
                  <h2>Seu contexto atual</h2>
                </div>
              </div>
              <div className="activity-grid">
                <article className="activity-card">
                  <div className="activity-icon">
                    <Target size={18} />
                  </div>
                  <div>
                    <strong>{!userProgress.hasFinished ? 'Próxima etapa pronta' : 'Sem próxima etapa'}</strong>
                    <p>
                      {!userProgress.hasFinished
                        ? userProgress.nextStepText
                        : 'A trilha atual já foi concluída.'}
                    </p>
                  </div>
                </article>
                <article className="activity-card">
                  <div className="activity-icon">
                    <FileText size={18} />
                  </div>
                  <div>
                    <strong>Certificado</strong>
                    <p>Seu certificado usa o nome do login e a trilha do seu departamento.</p>
                  </div>
                </article>
              </div>
            </section>

            <div className="modules-grid">
              {visibleSectors.map((sector) => (
                <SectorCard key={sector.id} sector={sector} currentUser={currentUser} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
