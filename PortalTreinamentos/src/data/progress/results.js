import { createId, readResults, writeResults } from './shared';

export const getQuizResults = () => readResults();

export const recordQuizResult = ({
  user,
  moduleId,
  moduleTitle,
  levelId,
  levelTitle,
  quizTitle,
  score,
  totalQuestions,
}) => {
  if (!user) return null;

  const safeTotalQuestions = totalQuestions > 0 ? totalQuestions : 0;
  const percent = safeTotalQuestions ? Math.round((score / safeTotalQuestions) * 100) : 0;
  const result = {
    id: createId('result'),
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    moduleId: String(moduleId),
    moduleTitle,
    levelId,
    levelTitle,
    quizTitle,
    score,
    totalQuestions,
    percent,
    submittedAt: new Date().toISOString(),
  };

  writeResults([...readResults(), result]);
  return result;
};
