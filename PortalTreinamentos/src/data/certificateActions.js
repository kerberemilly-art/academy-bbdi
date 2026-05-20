import { recordCertificate, getLatestCertificateByUser } from './certificateStorage';
import { getMarketingCertificateStatus } from './certificateEligibility';
import { getLatestResultsByUser, getQuizResults } from './progressStorage';
import { getDepartmentLabel, getUserDepartmentId } from './sectorAccess';

const MARKETING_CERTIFICATE_STEPS = {
  final: { moduleId: '7', levelId: 'teste-final' },
  compatibility: { moduleId: '8', levelId: 'guia-compatibilidade' },
};

const getLatestMarketingCertificateResults = (userId) => {
  const latestResults = getLatestResultsByUser(getQuizResults());
  return {
    finalResult: latestResults.get(`${userId}:${MARKETING_CERTIFICATE_STEPS.final.moduleId}:${MARKETING_CERTIFICATE_STEPS.final.levelId}`) ?? null,
  };
};

const buildCertificatePayload = (user, existing, options = {}) => {
  const { finalResult } = getLatestMarketingCertificateResults(user.id);
  const departmentId = getUserDepartmentId(user);
  const trainingTrailName = getDepartmentLabel(departmentId);

  return {
    user,
    moduleId: MARKETING_CERTIFICATE_STEPS.final.moduleId,
    moduleTitle: 'Avaliação Final Produtos',
    sectorTitle: 'Marketing de Produtos',
    trainingTrailName,
    departmentId,
    programKey: 'marketing-products',
    levelId: MARKETING_CERTIFICATE_STEPS.final.levelId,
    levelTitle: 'Teste Final',
    quizTitle: 'Certificado de Marketing de Produtos',
    score: options.score ?? existing?.score ?? finalResult?.score ?? 0,
    totalQuestions: options.totalQuestions ?? existing?.totalQuestions ?? finalResult?.totalQuestions ?? 0,
    percent: options.percent ?? existing?.percent ?? finalResult?.percent ?? 0,
  };
};

export const issueMarketingCertificateIfEligible = (user, options = {}) => {
  if (!user) {
    return null;
  }

  const status = getMarketingCertificateStatus(user.id);

  if (!status.isEligible) {
    return null;
  }

  const existing = getLatestCertificateByUser(user.id);

  if (existing?.programKey === status.programKey && !options.force) {
    if (existing.totalQuestions > 0) {
      return existing;
    }

    const payload = buildCertificatePayload(user, existing, options);
    return recordCertificate(payload);
  }

  const payload = buildCertificatePayload(user, existing, options);

  if (payload.totalQuestions <= 0) {
    return existing;
  }

  return recordCertificate(payload);
};
