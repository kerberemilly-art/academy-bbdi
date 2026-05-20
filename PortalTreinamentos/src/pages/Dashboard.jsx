import { useMemo } from 'react';
import {
  LogOut,
  BookOpen,
  Users,
  BarChart3,
  ClipboardCheck,
  CheckCircle,
  Target,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SectorCard from '../components/SectorCard';
import { modulesData } from '../data/modulesData';
import { getSectorSummaries } from '../data/trainingCatalog';
import { getMarketingTrainingProgress } from '../data/trainingPath';
import { getLatestResultsByUser, getQuizResults, getTrainingTests } from '../data/progressStorage';
import { getUsers } from '../data/usersStorage';
import './Dashboard.css';

const Dashboard = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const displayName = currentUser.name?.trim() || 'Usuário';
  const sectors = getSectorSummaries();
  const trainingProgress = getMarketingTrainingProgress(currentUser.id);

  const masterProgress = useMemo(() => {
    const users = getUsers().filter((user) => user.role !== 'master');
    const activeUsers = users.filter((user) => user.active);
    const tests = getTrainingTests(modulesData);
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

  const isMaster = currentUser.role === 'master';

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header glass-panel">
        <div className="header-content container">
          <div className="header-logo">
            <BookOpen size={28} color="var(--accent-color)" />
            <h2>Portal de Treinamentos</h2>
          </div>
          <div className="header-actions">
            <div className="user-profile">
              <div className="avatar">{displayName.charAt(0).toUpperCase()}</div>
              <span>{displayName}</span>
            </div>
            {currentUser.role === 'master' && (
              <>
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
        {isMaster ? (
          <>
            <div className="welcome-section master-welcome">
              <div>
                <h1>Olá, {displayName}! 👋</h1>
              </div>
            </div>

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
                  {sectors.map((sector) => (
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
            <div className="welcome-section">
              <h1>Olá, {displayName}! 👋</h1>
              <p>Selecione um departamento abaixo para iniciar seus estudos.</p>
            </div>

            <section className="user-progress-panel glass-panel">
              <div className="panel-heading spaced">
                <div>
                  <span className="section-kicker">Seu progresso</span>
                  <h2>
                    {trainingProgress.progressPercent}
                    % concluído
                  </h2>
                </div>
                <div className="progress-counts">
                  <strong>{trainingProgress.completedSteps}/{trainingProgress.totalSteps}</strong>
                  <span>etapas</span>
                </div>
              </div>

              <div className="training-progress-track" aria-label="Progresso do treinamento">
                <span style={{ width: `${trainingProgress.progressPercent}%` }} />
              </div>

              <div className="progress-meta">
                <span>
                  Faltam
                  {' '}
                  <strong>{trainingProgress.remainingSteps}</strong>
                  {' '}
                  etapas
                </span>
                <span>
                  Próximo:
                  {' '}
                  <strong>
                    {trainingProgress.nextStep
                      ? `${modulesData[trainingProgress.nextStep.moduleId]?.title} - ${trainingProgress.nextStep.levelTitle}`
                      : 'Nenhum'}
                  </strong>
                </span>
              </div>
            </section>

            <div className="modules-grid">
              {sectors.map((sector) => (
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
