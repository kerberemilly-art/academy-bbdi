export const getTrainingTests = (modulesData) => Object.values(modulesData).flatMap((moduleInfo) => (
  moduleInfo.levels
    .filter((level) => level.lesson?.quiz)
    .map((level) => ({
      key: `${moduleInfo.id}:${level.id}`,
      moduleId: String(moduleInfo.id),
      moduleTitle: moduleInfo.title,
      levelId: level.id,
      levelTitle: level.title,
      quizTitle: level.lesson.quiz.title,
      color: moduleInfo.color,
    }))
));

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
