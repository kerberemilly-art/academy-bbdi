import { sectorsData } from '../sectorsData';

export const getTrainingTests = (modulesData, customTrainings = []) => {
  const builtinTests = Object.values(modulesData).flatMap((moduleInfo) => (
    (moduleInfo.levels ?? [])
      .filter((level) => level.lesson?.quiz)
      .map((level) => ({
        key: `${moduleInfo.id}:${level.id}`,
        moduleId: String(moduleInfo.id),
        moduleTitle: moduleInfo.title,
        levelId: level.id,
        levelTitle: level.title,
        quizTitle: level.lesson.quiz.title ?? `${moduleInfo.title} - Quiz`,
        color: moduleInfo.color,
      }))
  ));

  const customTests = customTrainings.map((training) => {
    const sector = sectorsData.find((s) => s.id === training.departmentId);
    return {
      key: `custom:${training.id}`,
      moduleId: String(training.moduleId),
      moduleTitle: training.moduleId, // or training.title
      levelId: training.level,
      levelTitle: training.level === 'basico' ? 'Básico' : training.level === 'intermediario' ? 'Intermediário' : 'Avançado',
      quizTitle: training.title,
      color: sector?.color || '#3b82f6',
      isCustom: true,
      trainingId: training.id
    };
  });

  // Combine and deduplicate if necessary, but custom trainings might override builtins
  // For now, just combine them.
  return [...builtinTests, ...customTests];
};

export const getLatestResultsByUser = (results) => {
  const latestResults = new Map();

  results.forEach((result) => {
    const key = `${result.userId}:${result.moduleId}:${result.levelId}`;
    const currentResult = latestResults.get(key);

    if (!currentResult || new Date(result.submittedAt) > new Date(currentResult.submittedAt)) {
      latestResults.set(key, result);
    }
  });

  return latestResults;
};
