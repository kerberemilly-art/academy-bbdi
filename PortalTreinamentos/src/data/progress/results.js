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

  const percent = Math.round((score / totalQuestions) * 100);
  const result = {
    id: createId(),
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
