import { modulesData } from './modulesData';
import { getLatestResultsByUser, getQuizResults } from './progressStorage';

export const MARKETING_MODULE_SEQUENCE = ['1', '2', '3', '4', '5', '6', '7', '8'];

export const getMarketingTrainingSequence = () => (
  MARKETING_MODULE_SEQUENCE.flatMap((moduleId) => {
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
      moduleOrder: MARKETING_MODULE_SEQUENCE.indexOf(String(moduleInfo.id)),
    }));
  })
);

const buildStepStatusMap = (userId) => {
  const latestResults = getLatestResultsByUser(getQuizResults());
  const sequence = getMarketingTrainingSequence();
  const statusMap = new Map();

  sequence.forEach((step, index) => {
    const key = `${userId}:${step.moduleId}:${step.levelId}`;
    statusMap.set(key, Boolean(userId && latestResults.has(key)));
    step.sequenceIndex = index;
  });

  return { latestResults, sequence, statusMap };
};

export const getMarketingTrainingProgress = (userId) => {
  const sequence = getMarketingTrainingSequence();
  const { latestResults } = buildStepStatusMap(userId);
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
  const completedModules = MARKETING_MODULE_SEQUENCE.reduce((count, moduleId) => {
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
  if (user?.role === 'master') {
    return true;
  }

  if (!user) {
    return false;
  }

  const progress = getMarketingTrainingProgress(user.id);

  if (!progress.nextStep) {
    return true;
  }

  const normalizedModuleId = String(moduleId);
  const moduleIndex = MARKETING_MODULE_SEQUENCE.indexOf(normalizedModuleId);
  const nextModuleIndex = MARKETING_MODULE_SEQUENCE.indexOf(progress.nextStep.moduleId);

  if (moduleIndex === -1 || nextModuleIndex === -1) {
    return false;
  }

  return moduleIndex <= nextModuleIndex;
};

export const getMarketingModuleProgress = (userId, moduleId) => {
  const moduleInfo = modulesData[String(moduleId)];
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
  const moduleInfo = modulesData[normalizedModuleId];
  const progress = user?.role === 'master'
    ? { nextStep: null }
    : getMarketingTrainingProgress(user?.id);

  const currentLevelIndex = moduleInfo?.levels.findIndex((level) => level.id === levelId) ?? -1;
  const nextStep = progress.nextStep;
  const moduleOrder = MARKETING_MODULE_SEQUENCE.indexOf(normalizedModuleId);
  const nextModuleOrder = nextStep ? MARKETING_MODULE_SEQUENCE.indexOf(nextStep.moduleId) : Number.POSITIVE_INFINITY;
  const nextLevelIndex = nextStep && nextStep.moduleId === normalizedModuleId
    ? moduleInfo?.levels.findIndex((level) => level.id === nextStep.levelId) ?? -1
    : Number.POSITIVE_INFINITY;

  const isCompleted = Boolean(
    user?.id
    && moduleInfo
    && moduleInfo.levels.some((level) => level.id === levelId)
    && getLatestResultsByUser(getQuizResults()).has(`${user.id}:${normalizedModuleId}:${levelId}`)
  );

  const isLocked = user?.role !== 'master' && (
    moduleOrder > nextModuleOrder
    || (moduleOrder === nextModuleOrder && currentLevelIndex > nextLevelIndex)
  );

  return {
    moduleId: normalizedModuleId,
    levelId,
    isLocked,
    isCompleted,
    requiredModuleId: user?.role === 'master' ? null : nextStep?.moduleId ?? null,
    requiredLevelId: user?.role === 'master' ? null : nextStep?.levelId ?? null,
    moduleInfo,
    currentLevelIndex,
    nextLevelIndex,
  };
};

export const getMarketingModuleStatus = (user, moduleId) => {
  const normalizedModuleId = String(moduleId);
  const progress = user?.role === 'master'
    ? { nextStep: null, completedModules: MARKETING_MODULE_SEQUENCE.length }
    : getMarketingTrainingProgress(user?.id);
  const nextStep = progress.nextStep;
  const moduleOrder = MARKETING_MODULE_SEQUENCE.indexOf(normalizedModuleId);
  const nextModuleOrder = nextStep ? MARKETING_MODULE_SEQUENCE.indexOf(nextStep.moduleId) : Number.POSITIVE_INFINITY;
  const moduleInfo = modulesData[normalizedModuleId];
  const latestResults = getLatestResultsByUser(getQuizResults());

  const isCompleted = Boolean(user?.id && moduleInfo && moduleInfo.levels.every((level) => (
    latestResults.has(`${user.id}:${normalizedModuleId}:${level.id}`)
  )));

  return {
    moduleId: normalizedModuleId,
    moduleIndex: moduleOrder,
    isLocked: user?.role !== 'master' && moduleOrder > nextModuleOrder,
    isCompleted,
    requiredModuleId: user?.role === 'master' ? null : nextStep?.moduleId ?? null,
    nextModuleId: nextStep?.moduleId ?? null,
    progress,
    moduleInfo,
  };
};
