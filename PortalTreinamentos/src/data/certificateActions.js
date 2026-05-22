import { recordCertificate, getLatestCertificateByUser } from '../api/certificateStorage';
import { getDepartmentLabel, getUserDepartmentId } from './sectorAccess';

export const issueQuizCertificate = (user, quizResult) => {
  if (!user || !quizResult) {
    return null;
  }

  const departmentId = getUserDepartmentId(user);
  const sectorTitle = getDepartmentLabel(departmentId);

  const payload = {
    user,
    moduleId: quizResult.moduleId,
    moduleTitle: quizResult.moduleTitle,
    sectorTitle,
    departmentId,
    programKey: `${quizResult.moduleId}-${quizResult.levelId}`,
    levelId: quizResult.levelId,
    levelTitle: quizResult.levelTitle,
    quizTitle: quizResult.quizTitle,
    score: quizResult.score,
    totalQuestions: quizResult.totalQuestions,
    percent: quizResult.percent,
  };

  return recordCertificate(payload);
};
