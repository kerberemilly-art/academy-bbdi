import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, CheckCircle, ClipboardList, Target, Users } from 'lucide-react';
import { modulesData } from '../data/modulesData';
import { getLatestResultsByUser, getQuizResults, getTrainingTests } from '../data/progressStorage';
import { getUsers } from '../data/usersStorage';
import { sectorsData } from '../data/sectorsData';
import { getUserDepartmentIds, isSuperAdmin } from '../data/sectorAccess';
import './AdminProgress.css';

const formatDateTime = (date) => {
  if (!date) return 'Sem registro';

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

const getStatusLabel = (percent) => {
  if (percent >= 80) return 'Ótimo';
  if (percent >= 60) return 'Atenção';
  return 'Revisar';
};

const AdminProgress = ({ currentUser }) => {
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState('');
  const [results] = useState(() => getQuizResults());
  const [users] = useState(() => getUsers());
  const isMaster = isSuperAdmin(currentUser);
  const accessibleDepartmentIds = isMaster
    ? sectorsData.map((sector) => sector.id)
    : getUserDepartmentIds(currentUser);
  const accessibleModuleIds = useMemo(() => {
    const moduleIds = sectorsData
      .filter((sector) => accessibleDepartmentIds.includes(sector.id))
      .flatMap((sector) => sector.moduleIds ?? []);

    return [...new Set(moduleIds.map((moduleId) => String(moduleId)))];
  }, [accessibleDepartmentIds]);

  const tests = useMemo(() => getTrainingTests(modulesData).filter(
    (test) => accessibleModuleIds.includes(test.moduleId),
  ), [accessibleModuleIds]);
  const collaborators = useMemo(
    () => users.filter((user) => user.role !== 'master' && user.role !== 'admin' && (
      isMaster || getUserDepartmentIds(user).some((departmentId) => accessibleDepartmentIds.includes(departmentId))
    )),
    [accessibleDepartmentIds, isMaster, users],
  );
  const latestResults = useMemo(() => getLatestResultsByUser(results), [results]);

  const selectedUser = useMemo(() => {
    if (selectedUserId) return collaborators.find((user) => user.id === selectedUserId);
    return collaborators[0];
  }, [collaborators, selectedUserId]);

  const userSummaries = useMemo(() => collaborators.map((user) => {
    const userLatestResults = tests
      .map((test) => latestResults.get(`${user.id}:${test.moduleId}:${test.levelId}`))
      .filter(Boolean);
    const completed = userLatestResults.length;
    const average = completed
      ? Math.round(userLatestResults.reduce((sum, result) => sum + result.percent, 0) / completed)
      : 0;
    const latestDate = userLatestResults
      .map((result) => result.submittedAt)
      .sort((a, b) => new Date(b) - new Date(a))[0];

    return {
      user,
      completed,
      pending: tests.length - completed,
      average,
      progress: tests.length ? Math.round((completed / tests.length) * 100) : 0,
      latestDate,
    };
  }), [collaborators, latestResults, tests]);

  const selectedSummary = userSummaries.find((summary) => summary.user.id === selectedUser?.id);

  const detailRows = useMemo(() => {
    if (!selectedUser) return [];

    return tests.map((test) => {
      const result = latestResults.get(`${selectedUser.id}:${test.moduleId}:${test.levelId}`);
      const attempts = results.filter(
        (item) => item.userId === selectedUser.id && item.moduleId === test.moduleId && item.levelId === test.levelId,
      ).length;

      return { test, result, attempts };
    });
  }, [latestResults, results, selectedUser, tests]);

  const totalCompleted = userSummaries.reduce((sum, summary) => sum + summary.completed, 0);
  const totalPossible = collaborators.length * tests.length;
  const overallProgress = totalPossible ? Math.round((totalCompleted / totalPossible) * 100) : 0;
  const activeCollaborators = collaborators.filter((user) => user.active).length;
  const averageScore = userSummaries.length
    ? Math.round(userSummaries.reduce((sum, summary) => sum + summary.average, 0) / userSummaries.length)
    : 0;

  return (
    <div className="admin-progress-wrapper animate-fade-in">
      <header className="admin-progress-header glass-panel">
        <div className="container admin-progress-header-content">
          <button className="btn-back" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={22} />
            <span>Voltar</span>
          </button>
          <div className="admin-progress-title">
            <BarChart3 size={28} color="var(--accent-color)" />
            <h2>Desenvolvimento dos Colaboradores</h2>
          </div>
        </div>
      </header>

      <main className="container admin-progress-main">
        <section className="progress-summary-grid">
          <div className="progress-metric glass-panel">
            <Users size={24} color="var(--accent-color)" />
            <strong>{activeCollaborators}</strong>
            <span>colaboradores ativos</span>
          </div>
          <div className="progress-metric glass-panel">
            <ClipboardList size={24} color="var(--accent-color)" />
            <strong>{tests.length}</strong>
            <span>testes disponíveis</span>
          </div>
          <div className="progress-metric glass-panel">
            <CheckCircle size={24} color="var(--accent-color)" />
            <strong>{overallProgress}%</strong>
            <span>conclusão geral</span>
          </div>
          <div className="progress-metric glass-panel">
            <Target size={24} color="var(--accent-color)" />
            <strong>{averageScore}%</strong>
            <span>média dos colaboradores</span>
          </div>
        </section>

        <section className="collaborator-progress glass-panel">
          <div className="section-header">
            <div>
              <span className="section-kicker">Visão geral</span>
              <h1>Acompanhamento por colaborador</h1>
            </div>
            <button className="btn-users-link" onClick={() => navigate('/admin/users')}>
              Gerenciar usuários
            </button>
          </div>

          <div className="progress-table">
            <div className="progress-table-head">
              <span>Colaborador</span>
              <span>Conclusão</span>
              <span>Média</span>
              <span>Última atividade</span>
            </div>

            {userSummaries.map((summary) => (
              <button
                key={summary.user.id}
                type="button"
                className={`progress-user-row ${selectedUser?.id === summary.user.id ? 'selected' : ''}`}
                onClick={() => setSelectedUserId(summary.user.id)}
              >
                <span className="progress-user">
                  <span className="progress-avatar">{summary.user.name.charAt(0).toUpperCase()}</span>
                  <span>
                    <strong>{summary.user.name}</strong>
                    <small>{summary.user.email}</small>
                  </span>
                </span>
                <span>
                  <strong>{summary.completed}/{tests.length}</strong>
                  <span className="inline-progress">
                    <span style={{ width: `${summary.progress}%` }} />
                  </span>
                </span>
                <span className={`score-pill ${summary.average >= 80 ? 'good' : summary.average >= 60 ? 'warn' : 'low'}`}>
                  {summary.average}%
                </span>
                <span className="muted">{formatDateTime(summary.latestDate)}</span>
              </button>
            ))}

            {!userSummaries.length && (
              <div className="empty-progress">Nenhum colaborador cadastrado ainda.</div>
            )}
          </div>
        </section>

        {selectedUser && (
          <section className="test-detail-panel glass-panel">
            <div className="section-header">
              <div>
                <span className="section-kicker">Detalhe individual</span>
                <h2>{selectedUser.name}</h2>
                <p>
                  {selectedSummary.completed} testes concluídos, {selectedSummary.pending} pendentes.
                </p>
              </div>
              <span className="large-score">{selectedSummary.average}% média</span>
            </div>

            <div className="tests-grid">
              {detailRows.map(({ test, result, attempts }) => (
                <div key={test.key} className="test-card">
                  <div className="test-card-header">
                    <span className="module-dot" style={{ backgroundColor: test.color }} />
                    <strong>{test.moduleTitle}</strong>
                    <span className={`test-status ${result ? 'done' : 'pending'}`}>
                      {result ? 'Concluído' : 'Pendente'}
                    </span>
                  </div>
                  <h3>{test.levelTitle}</h3>
                  <p>{test.quizTitle}</p>
                  {result ? (
                    <div className="test-result">
                      <span className={`score-pill ${result.percent >= 80 ? 'good' : result.percent >= 60 ? 'warn' : 'low'}`}>
                        {result.percent}% - {getStatusLabel(result.percent)}
                      </span>
                      <span>{result.score}/{result.totalQuestions} acertos</span>
                      <span>{attempts} tentativa{attempts === 1 ? '' : 's'}</span>
                      <span>{formatDateTime(result.submittedAt)}</span>
                    </div>
                  ) : (
                    <div className="test-result muted">Ainda não realizado.</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminProgress;
