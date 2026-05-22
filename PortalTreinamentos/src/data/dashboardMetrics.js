import { modulesData } from './modulesData';
import { getMarketingTrainingProgress } from './trainingPath';
import { getLatestResultsByUser, getQuizResults, getTrainingTests } from '../api/progressStorage';
import { getUsers } from '../api/usersStorage';
import { canAccessSector, getUserDepartmentId, getUserDepartmentIds } from './sectorAccess';

export const getUserProgressSummary = (currentUser, sectors = [], isAnyAdmin = false) => {
  if (isAnyAdmin) return null;

  const userDeptId = getUserDepartmentId(currentUser) || 'marketing-produtos';
  const prog = getMarketingTrainingProgress(currentUser.id, userDeptId);
  const sector = sectors.find((item) => item.id === userDeptId);

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
};

export const getCollaboratorStats = (currentUser, visibleSectors = [], isAnyAdmin = false) => {
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

  const totalCompletedSteps = visibleSectors.reduce((sum, sector) => {
    const prog = getMarketingTrainingProgress(currentUser.id, sector.id);
    return sum + (prog.completedSteps || 0);
  }, 0);
  
  const totalMinutes = (totalCompletedSteps * 15) + (completedCount * 25);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  const formattedStudyTime = hours > 0 
    ? `${hours}h ${minutes}m` 
    : `${minutes}m`;

  const estimatedHours = Math.max(0.2, parseFloat((totalMinutes / 60).toFixed(1)));

  let certificatesCount = 0;
  visibleSectors.forEach((sector) => {
    const prog = getMarketingTrainingProgress(currentUser.id, sector.id);
    if (prog.totalSteps > 0 && prog.completedSteps === prog.totalSteps) {
      certificatesCount++;
    }
  });

  return {
    completedCount,
    averageScore,
    estimatedHours,
    formattedStudyTime,
    certificatesCount,
  };
};

export const getDonutData = (currentUser, visibleSectors = [], isAnyAdmin = false) => {
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

  const totalCompleted = sectorsInfo.reduce((sum, sector) => sum + sector.completed, 0);

  if (totalCompleted === 0) {
    return {
      total: 0,
      segments: sectorsInfo.map((sector) => ({
        ...sector,
        percentageOfTotal: 100 / (sectorsInfo.length || 1),
      })),
      isEmpty: true,
    };
  }

  return {
    total: totalCompleted,
    segments: sectorsInfo.map((sector) => ({
      ...sector,
      percentageOfTotal: (sector.completed / totalCompleted) * 100,
    })),
    isEmpty: false,
  };
};

export const getMasterProgress = (currentUser, sectors = [], isAdmin = false) => {
  let users = getUsers().filter((user) => user.role !== 'master' && user.role !== 'admin');

  if (isAdmin) {
    const adminDeptIds = getUserDepartmentIds(currentUser);
    users = users.filter((user) => {
      const userDeptIds = getUserDepartmentIds(user);
      return userDeptIds.some((deptId) => adminDeptIds.includes(deptId));
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
};

export const getRecentActivity = (trainings = [], currentUser, sectors = [], isAdmin = false) => {
  const latestTraining = [...trainings]
    .sort((a, b) => new Date(b.updatedAt ?? b.createdAt ?? 0) - new Date(a.updatedAt ?? a.createdAt ?? 0))[0];

  let users = getUsers().filter((user) => user.role !== 'master' && user.role !== 'admin');
  if (isAdmin) {
    const adminDeptIds = getUserDepartmentIds(currentUser);
    users = users.filter((user) => {
      const userDeptIds = getUserDepartmentIds(user);
      return userDeptIds.some((deptId) => adminDeptIds.includes(deptId));
    });
  }

  const recentCollaborator = [...users]
    .sort((a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0))[0];
  const highlightedSector = sectors.find((sector) => sector.status === 'active') ?? sectors[0] ?? null;

  return [
    {
      id: 'latest-training',
      iconKey: 'training',
      title: latestTraining ? latestTraining.title : 'Nenhum treinamento cadastrado',
      subtitle: latestTraining
        ? `Atualizado em ${new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(latestTraining.updatedAt ?? latestTraining.createdAt))}`
        : 'Ainda não há conteúdo publicado',
    },
    {
      id: 'recent-user',
      iconKey: 'user',
      title: recentCollaborator ? recentCollaborator.name : 'Nenhum colaborador recente',
      subtitle: recentCollaborator
        ? `Cadastrado em ${new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(recentCollaborator.createdAt))}`
        : 'Sem movimentação de usuários',
    },
    {
      id: 'sector',
      iconKey: 'sector',
      title: highlightedSector ? highlightedSector.title : 'Nenhum departamento',
      subtitle: highlightedSector ? highlightedSector.description : 'Sem departamentos configurados',
    },
  ];
};

export const buildMentorContext = ({
  isMaster,
  isAdmin,
  displayName,
  visibleSectors,
  masterProgress,
  userProgress,
  collaboratorStats,
}) => {
  if (isMaster) return '';

  if (isAdmin) {
    return [
      `Administrador: ${displayName}`,
      `Departamentos acessíveis: ${visibleSectors.map((sector) => sector.title).join(', ') || 'Nenhum'}`,
      `Treinamentos visíveis no painel: ${visibleSectors.length}`,
      `Média geral de desempenho: ${masterProgress.averageScore}%`,
      `Usuários ativos sob acompanhamento: ${masterProgress.activeUsers}`,
      `Total de quizzes monitorados: ${masterProgress.tests}`,
      'Ajude a interpretar métricas, acompanhar treinamentos e orientar ações de gestão.',
    ].join('\n');
  }

  return [
    `Colaborador: ${displayName}`,
    `Departamento atual: ${userProgress?.deptTitle ?? 'N/A'}`,
    `Progresso da trilha: ${userProgress?.progressPercent ?? 0}%`,
    `Etapas concluídas: ${userProgress?.completedSteps ?? 0} de ${userProgress?.totalSteps ?? 0}`,
    `Próxima meta: ${userProgress?.nextStepText ?? 'Nenhuma'}`,
    `Quizzes concluídos: ${collaboratorStats?.completedCount ?? 0}`,
    `Média nos quizzes: ${collaboratorStats?.averageScore ?? 0}%`,
    `Horas estimadas de estudo: ${collaboratorStats?.estimatedHours ?? 0}h`,
    `Certificados: ${collaboratorStats?.certificatesCount ?? 0}`,
    'Ajude o colaborador a entender próximos passos, tirar dúvidas sobre a trilha e organizar o estudo.',
  ].join('\n');
};
