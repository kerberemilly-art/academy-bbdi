import { modulesData } from './modulesData';
import { getLatestResultsByUser, getQuizResults } from './progressStorage';
import { sectorsData } from './sectorsData';
import { getCachedTrainings } from './trainingAdminApi';

export const getSectorForModule = (moduleId) => {
  const idNum = Number(moduleId);
  if (!isNaN(idNum)) {
    const sect = sectorsData.find((s) => s.moduleIds.includes(idNum));
    if (sect) return sect;
  }

  // Look up in custom trainings for custom module names
  const trainings = getCachedTrainings();
  const matched = trainings.find((t) => String(t.moduleId).trim().toLowerCase() === String(moduleId).trim().toLowerCase());
  if (matched) {
    return sectorsData.find((s) => s.id === matched.departmentId);
  }

  return null;
};

export const getSectorModuleSequence = (sectorId) => {
  const sector = sectorsData.find((s) => s.id === sectorId);
  return sector ? sector.moduleIds.map(String) : [];
};

export const MARKETING_MODULE_SEQUENCE = ['1', '2', '3', '4', '5', '6', '7', '8'];

export const getMarketingTrainingSequence = (sectorId = 'marketing-produtos') => {
  const sequence = getSectorModuleSequence(sectorId);
  return sequence.flatMap((moduleId) => {
    const moduleInfo = modulesData[moduleId];

    if (!moduleInfo) {
      return [];
    }

    return moduleInfo.levels.map((level, levelIndex) => ({
      moduleId: String(moduleInfo.id),
      moduleTitle: moduleInfo.title,
      levelId: level.id,
      levelTitle: level.title,
      levelIndex,
      moduleOrder: sequence.indexOf(String(moduleInfo.id)),
    }));
  });
};

const buildStepStatusMap = (userId, sectorId) => {
  const latestResults = getLatestResultsByUser(getQuizResults());
  const sequence = getMarketingTrainingSequence(sectorId);
  const statusMap = new Map();

  sequence.forEach((step, index) => {
    const key = `${userId}:${step.moduleId}:${step.levelId}`;
    statusMap.set(key, Boolean(userId && latestResults.has(key)));
    step.sequenceIndex = index;
  });

  return { latestResults, sequence, statusMap };
};

export const getMarketingTrainingProgress = (userId, sectorId = 'marketing-produtos') => {
  const sequence = getMarketingTrainingSequence(sectorId);
  const { latestResults } = buildStepStatusMap(userId, sectorId);
  let completedSteps = 0;
  let nextStep = null;

  for (const step of sequence) {
    const key = `${userId}:${step.moduleId}:${step.levelId}`;

    if (userId && latestResults.has(key)) {
      completedSteps += 1;
      continue;
    }

    nextStep = step;
    break;
  }

  const totalSteps = sequence.length;
  const moduleSequence = getSectorModuleSequence(sectorId);
  const completedModules = moduleSequence.reduce((count, moduleId) => {
    const moduleInfo = modulesData[moduleId];

    if (!moduleInfo) {
      return count;
    }

    const moduleDone = moduleInfo.levels.every((level) => latestResults.has(`${userId}:${moduleId}:${level.id}`));
    return moduleDone ? count + 1 : count;
  }, 0);

  return {
    totalSteps,
    completedSteps,
    remainingSteps: totalSteps - completedSteps,
    completedModules,
    progressPercent: totalSteps ? Math.round((completedSteps / totalSteps) * 100) : 0,
    nextStep,
    nextModuleId: nextStep?.moduleId ?? null,
    nextLevelId: nextStep?.levelId ?? null,
  };
};

export const canAccessMarketingModule = (user, moduleId) => {
  if (user?.role === 'master' || user?.role === 'admin') {
    return true;
  }

  if (!user) {
    return false;
  }

  const idNum = Number(moduleId);
  if (isNaN(idNum)) {
    // Custom modules are unlocked by default
    return true;
  }

  const sector = getSectorForModule(moduleId);
  if (!sector) {
    return false;
  }

  const progress = getMarketingTrainingProgress(user.id, sector.id);

  if (!progress.nextStep) {
    return true;
  }

  const normalizedModuleId = String(moduleId);
  const sequence = getSectorModuleSequence(sector.id);
  const moduleIndex = sequence.indexOf(normalizedModuleId);
  const nextModuleIndex = sequence.indexOf(progress.nextStep.moduleId);

  if (moduleIndex === -1 || nextModuleIndex === -1) {
    return false;
  }

  return moduleIndex <= nextModuleIndex;
};

export const getMarketingModuleProgress = (userId, moduleId) => {
  let moduleInfo = modulesData[String(moduleId)];
  if (!moduleInfo) {
    // Resolve dynamic custom module
    const trainings = getCachedTrainings();
    const matched = trainings.find((t) => String(t.moduleId).trim().toLowerCase() === String(moduleId).trim().toLowerCase());
    if (matched) {
      moduleInfo = {
        id: matched.moduleId,
        levels: [
          { id: 'basico' },
          { id: 'intermediario' },
          { id: 'avancado' }
        ]
      };
    }
  }

  const latestResults = getLatestResultsByUser(getQuizResults());

  if (!moduleInfo) {
    return 0;
  }

  const completedLevels = moduleInfo.levels.filter((level) => (
    latestResults.has(`${userId}:${moduleId}:${level.id}`)
  )).length;

  return moduleInfo.levels.length ? Math.round((completedLevels / moduleInfo.levels.length) * 100) : 0;
};

export const getMarketingLevelStatus = (user, moduleId, levelId) => {
  const normalizedModuleId = String(moduleId);
  let moduleInfo = modulesData[normalizedModuleId];
  if (!moduleInfo) {
    // Resolve dynamic custom module
    const trainings = getCachedTrainings();
    const matched = trainings.find((t) => String(t.moduleId).trim().toLowerCase() === String(moduleId).trim().toLowerCase());
    if (matched) {
      moduleInfo = {
        id: matched.moduleId,
        levels: [
          { id: 'basico', title: 'Básico' },
          { id: 'intermediario', title: 'Intermediário' },
          { id: 'avancado', title: 'Avançado' }
        ]
      };
    }
  }

  const sector = getSectorForModule(moduleId);
  
  const progress = (user?.role === 'master' || user?.role === 'admin')
    ? { nextStep: null }
    : getMarketingTrainingProgress(user?.id, sector?.id || 'marketing-produtos');

  const currentLevelIndex = moduleInfo?.levels.findIndex((level) => level.id === levelId) ?? -1;
  const nextStep = progress.nextStep;
  const sequence = sector ? getSectorModuleSequence(sector.id) : MARKETING_MODULE_SEQUENCE;
  const moduleOrder = sequence.indexOf(normalizedModuleId);
  const nextModuleOrder = nextStep ? sequence.indexOf(nextStep.moduleId) : Number.POSITIVE_INFINITY;
  const nextLevelIndex = nextStep && nextStep.moduleId === normalizedModuleId
    ? moduleInfo?.levels.findIndex((level) => level.id === nextStep.levelId) ?? -1
    : Number.POSITIVE_INFINITY;

  const isCompleted = Boolean(
    user?.id
    && moduleInfo
    && moduleInfo.levels.some((level) => level.id === levelId)
    && getLatestResultsByUser(getQuizResults()).has(`${user.id}:${normalizedModuleId}:${levelId}`)
  );

  const idNum = Number(moduleId);
  const isLocked = user?.role !== 'master' && user?.role !== 'admin' && (
    !isNaN(idNum) ? (
      moduleOrder > nextModuleOrder || (moduleOrder === nextModuleOrder && currentLevelIndex > nextLevelIndex)
    ) : false
  );

  return {
    moduleId: normalizedModuleId,
    levelId,
    isLocked,
    isCompleted,
    requiredModuleId: (user?.role === 'master' || user?.role === 'admin') ? null : nextStep?.moduleId ?? null,
    requiredLevelId: (user?.role === 'master' || user?.role === 'admin') ? null : nextStep?.levelId ?? null,
    moduleInfo,
    currentLevelIndex,
    nextLevelIndex,
  };
};

export const getMarketingModuleStatus = (user, moduleId) => {
  const normalizedModuleId = String(moduleId);
  const sector = getSectorForModule(moduleId);
  const sequence = sector ? getSectorModuleSequence(sector.id) : MARKETING_MODULE_SEQUENCE;
  
  const progress = (user?.role === 'master' || user?.role === 'admin')
    ? { nextStep: null, completedModules: sequence.length }
    : getMarketingTrainingProgress(user?.id, sector?.id || 'marketing-produtos');
  const nextStep = progress.nextStep;
  const moduleOrder = sequence.indexOf(normalizedModuleId);
  const nextModuleOrder = nextStep ? sequence.indexOf(nextStep.moduleId) : Number.POSITIVE_INFINITY;
  
  let moduleInfo = modulesData[normalizedModuleId];
  if (!moduleInfo) {
    // Resolve dynamic custom module
    const trainings = getCachedTrainings();
    const matched = trainings.find((t) => String(t.moduleId).trim().toLowerCase() === String(moduleId).trim().toLowerCase());
    if (matched) {
      moduleInfo = {
        id: matched.moduleId,
        levels: [
          { id: 'basico' },
          { id: 'intermediario' },
          { id: 'avancado' }
        ]
      };
    }
  }

  const latestResults = getLatestResultsByUser(getQuizResults());

  const isCompleted = Boolean(user?.id && moduleInfo && moduleInfo.levels.every((level) => (
    latestResults.has(`${user.id}:${normalizedModuleId}:${level.id}`)
  )));

  const idNum = Number(moduleId);
  const isLocked = user?.role !== 'master' && user?.role !== 'admin' && (
    !isNaN(idNum) ? moduleOrder > nextModuleOrder : false
  );

  return {
    moduleId: normalizedModuleId,
    moduleIndex: moduleOrder,
    isLocked,
    isCompleted,
    requiredModuleId: (user?.role === 'master' || user?.role === 'admin') ? null : nextStep?.moduleId ?? null,
    nextModuleId: nextStep?.moduleId ?? null,
    progress,
    moduleInfo,
  };
};
