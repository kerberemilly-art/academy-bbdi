import { getQuizResults, getLatestResultsByUser } from './progressStorage';

const MARKETING_PROGRAM = {
  programKey: 'marketing-products',
  moduleIds: ['7', '8'],
};

export const getMarketingCertificateStatus = (userId) => {
  const latestResults = getLatestResultsByUser(getQuizResults());

  const completedModules = MARKETING_PROGRAM.moduleIds.filter((moduleId) => (
    latestResults.has(`${userId}:${moduleId}:teste-final`)
      || latestResults.has(`${userId}:${moduleId}:guia-compatibilidade`)
  ));

  return {
    programKey: MARKETING_PROGRAM.programKey,
    isEligible: completedModules.length === MARKETING_PROGRAM.moduleIds.length,
    completedModules,
  };
};
