import { useMemo } from 'react';
import {
  LogOut,
  BookOpen,
  Battery,
  Monitor,
  Keyboard,
  Cpu,
  HardDrive,
  Zap,
  Users,
  BarChart3,
  ClipboardCheck,
  FolderOpen,
  CheckCircle,
  Target,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { modulesData } from '../data/modulesData';
import { getLatestResultsByUser, getQuizResults, getTrainingTests } from '../data/progressStorage';
import { getUsers } from '../data/usersStorage';
import './Dashboard.css';

const Dashboard = ({ currentUser, onLogout }) => {
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
            <h2>Treinamento BBDI</h2>
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
                <p>Acompanhe os colaboradores e acesse a pasta de treinamentos.</p>
              </div>
              <button className="btn-primary master-progress-button" onClick={() => navigate('/admin/progress')}>
                <BarChart3 size={20} />
                Dashboard completo
              </button>
            </div>

            <section className="master-home-grid">
              <button className="training-folder glass-panel" onClick={() => navigate('/trainings')}>
                <div className="folder-icon">
                  <FolderOpen size={42} />
                </div>
                <div>
                  <span className="section-kicker">Pasta</span>
                  <h2>Treinamentos</h2>
                  <p>{modules.length} grupos disponíveis para estudo e avaliação.</p>
                </div>
              </button>

              <div className="master-progress-panel glass-panel">
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
              <p>Selecione um grupo de produtos abaixo para iniciar seus estudos.</p>
            </div>

            <div className="modules-grid">
              {modules.map((mod) => (
                <ProductCard key={mod.id} module={mod} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
