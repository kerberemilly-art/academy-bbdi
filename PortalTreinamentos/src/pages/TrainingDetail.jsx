import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle,
  ChevronRight,
  LogOut,
  RefreshCcw,
} from 'lucide-react';
import ContentBlockRenderer from '../components/ContentBlockRenderer';
import { canAccessSector, canManageSector } from '../data/sectorAccess';
import { sectorsData } from '../data/sectorsData';
import { fetchTrainings, getCachedTrainings } from '../api/trainingAdminApi';
import { recordQuizResult } from '../api/progressStorage';
import { modulesData } from '../data/modulesData';
import './Lesson.css';
import './TrainingDetail.css';
import Confetti from '../components/Confetti';

const getDepartment = (departmentId) => (
  sectorsData.find((sector) => sector.id === departmentId) ?? null
);

const TrainingDetail = ({ currentUser, onLogout }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [trainings, setTrainings] = useState(() => getCachedTrainings());
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const displayName = currentUser?.name?.trim() || 'Usuário';

  useEffect(() => {
    let cancelled = false;

    fetchTrainings()
      .then((items) => {
        if (!cancelled) {
          setTrainings(items);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const training = useMemo(() => trainings.find((item) => item.id === id) ?? null, [id, trainings]);
  const department = getDepartment(training?.departmentId);
  const backPath = location.state?.backPath || (training?.departmentId ? `/sector/${training.departmentId}` : '/dashboard');
  const canOpenTraining = training
    && canAccessSector(currentUser, training.departmentId)
    && (training.status === 'published' || canManageSector(currentUser, training.departmentId));

  const quizQuestions = Array.isArray(training?.quizQuestions) ? training.quizQuestions : [];
  const contentBlocks = Array.isArray(training?.contentBlocks) ? training.contentBlocks : [];
  const totalQuestions = quizQuestions.length;
  const answeredCount = Object.keys(quizAnswers).length;

  const score = quizQuestions.reduce((count, question) => (
    quizAnswers[question.id] === question.answerIndex ? count + 1 : count
  ), 0);
  const scorePercent = totalQuestions ? Math.round((score / totalQuestions) * 100) : 0;

  if (!training || !canOpenTraining) {
    return (
      <div className="training-detail-wrapper">
        <main className="container training-detail-main">
          <section className="training-detail-empty glass-panel">
            <BookOpen size={30} color="var(--accent-color)" />
            <h1>Treinamento não disponível</h1>
            <p>Este conteúdo não existe, não está publicado ou não pertence ao seu departamento.</p>
            <button className="btn-primary" onClick={() => navigate('/trainings')}>
              Voltar para treinamentos
            </button>
          </section>
        </main>
      </div>
    );
  }

  const handleAnswerSelect = (questionId, optionIndex) => {
    if (quizSubmitted) return;
    setQuizAnswers((current) => ({ ...current, [questionId]: optionIndex }));
  };

  const handleQuizSubmit = () => {
    const isModuleTraining = training.moduleId && training.level;
    const result = recordQuizResult({
      user: currentUser,
      moduleId: isModuleTraining ? String(training.moduleId) : training.id,
      moduleTitle: isModuleTraining ? (modulesData[training.moduleId]?.title ?? training.moduleId ?? training.title) : training.title,
      levelId: isModuleTraining ? training.level : 'training-quiz',
      levelTitle: isModuleTraining ? (training.level === 'basico' ? 'Básico' : training.level === 'intermediario' ? 'Intermediário' : 'Avançado') : training.title,
      quizTitle: `${training.title} - Quiz final`,
      score,
      totalQuestions,
    });

    if (result) {
      setQuizSubmitted(true);
    }
  };

  const handleQuizRetry = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  return (
    <div className="training-detail-wrapper animate-fade-in">
      <header className="training-detail-header glass-panel">
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '12px 0 16px' }}>
          <div className="training-detail-header-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', minHeight: 'auto' }}>
            <button className="btn-back compact" onClick={() => {
              if (showQuiz) {
                setShowQuiz(false);
              } else {
                navigate(backPath);
              }
            }}>
              <ArrowLeft size={20} />
              <span>Voltar</span>
            </button>
            <div className="training-detail-profile" style={{ minHeight: 'auto' }}>
              <div className="user-profile">
                <div className="avatar">{displayName.charAt(0).toUpperCase()}</div>
                <span>{displayName}</span>
              </div>
              <button onClick={onLogout} className="btn-logout" title="Sair">
                <LogOut size={20} />
              </button>
            </div>
          </div>
          <div className="progress-bar-container" style={{ width: '100%' }}>
            <div 
              className="progress-bar-fill"
              style={{ 
                width: `${showQuiz ? 100 : 50}%`,
                backgroundColor: department?.color || 'var(--accent-color)'
              }}
            ></div>
          </div>
        </div>
      </header>

      <main className="container training-detail-main">
        {!showQuiz ? (
          <>
            <section className="training-hero glass-panel">
              <div className="training-hero-copy">
                <span className="section-kicker">{department?.title ?? training.departmentId}</span>
                <h1>{training.title}</h1>
                <div className="training-hero-description">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {training.description ? training.description.replace(/\\n/g, '\n') : 'Treinamento estruturado para o departamento selecionado.'}
                  </ReactMarkdown>
                </div>
                <div className="training-hero-meta">
                  <span>{quizQuestions.length} perguntas no quiz</span>
                  <span>{training.level === 'intermediario' ? 'Intermediário' : training.level === 'avancado' ? 'Avançado' : 'Básico'}</span>
                  <span>{training.status === 'published' ? 'Publicado' : 'Rascunho'}</span>
                </div>
              </div>
              <div className="training-hero-side">
                <div className="training-hero-card">
                  <BookOpen size={22} />
                  <strong>Conteúdo</strong>
                  <span>Leitura estruturada em markdown.</span>
                </div>
                <div className="training-hero-card accent" style={{ background: department?.color ? `linear-gradient(180deg, ${department.color}, ${department.color}dd)` : undefined }}>
                  <Award size={22} />
                  <strong>Quiz final</strong>
                  <span>Validação com feedback imediato.</span>
                </div>
              </div>
            </section>

            <article className="training-content-panel glass-panel">
              <div className="training-content-heading">
                <div className="training-content-icon" style={{ backgroundColor: department?.color ? `${department.color}15` : undefined, color: department?.color }}>
                  <BookOpen size={26} />
                </div>
                <div>
                  <span className="section-kicker">Conteúdo do treinamento</span>
                  <h2>Leitura guiada</h2>
                </div>
              </div>

              <ContentBlockRenderer blocks={contentBlocks} fallbackContent={training.content} />

              {totalQuestions > 0 && (
                <div className="lesson-actions" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--panel-border)' }}>
                  <button 
                    className="btn-primary" 
                    style={{ backgroundColor: department?.color }}
                    onClick={() => {
                      setShowQuiz(true);
                      window.scrollTo(0, 0);
                    }}
                  >
                    Ir para o Quiz
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </article>
          </>
        ) : (
          <section className="quiz-container glass-panel animate-fade-in">
            <div className="quiz-header">
              <div>
                <span className="section-kicker">Quiz final</span>
                <h2>{training.title}</h2>
              </div>
              <p>
                {answeredCount} de {totalQuestions} perguntas respondidas
              </p>
            </div>

            {totalQuestions > 0 ? (
              <>
                <div className="questions-list">
                  {quizQuestions.map((question, questionIndex) => {
                    const selectedAnswer = quizAnswers[question.id];
                    const isCorrect = selectedAnswer === question.answerIndex;

                    return (
                      <div key={question.id} className="question-card">
                        <h3>{questionIndex + 1}. {question.question}</h3>
                        <div className="options-grid">
                          {question.options.map((option, optionIndex) => {
                            let optionClass = 'quiz-option';
                            if (selectedAnswer === optionIndex) optionClass += ' selected';

                            if (quizSubmitted) {
                              if (optionIndex === question.answerIndex) optionClass += ' correct';
                              else if (selectedAnswer === optionIndex) optionClass += ' incorrect';
                            }

                            return (
                              <button
                                key={optionIndex}
                                className={optionClass}
                                onClick={() => handleAnswerSelect(question.id, optionIndex)}
                                disabled={quizSubmitted}
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <div className={`answer-feedback ${isCorrect ? 'is-correct' : 'is-incorrect'}`}>
                            <strong>{isCorrect ? 'Resposta correta.' : 'Revisar este ponto.'}</strong>
                            <span>{question.explanation}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!quizSubmitted ? (
                  <div className="lesson-actions">
                    <button
                      className="btn-primary btn-submit-quiz"
                      onClick={handleQuizSubmit}
                      disabled={answeredCount < totalQuestions}
                      style={{ backgroundColor: department?.color }}
                    >
                      Finalizar quiz
                      <ChevronRight size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="quiz-results animate-fade-in">
                    <Confetti active={quizSubmitted && scorePercent >= 60} />
                    <div className="score-circle" style={{ borderColor: department?.color ?? 'var(--accent-color)' }}>
                      <Award size={40} color={department?.color ?? 'var(--accent-color)'} />
                      <span>{score} / {totalQuestions}</span>
                    </div>
                    <span className="score-percent">{scorePercent}% de aproveitamento</span>
                    <h3>Quiz concluído</h3>
                    <p>Treinamento finalizado com quiz no mesmo padrão dos conteúdos de Marketing de Produtos.</p>
                    <div className="quiz-result-actions">
                      <button className="btn-outline" onClick={handleQuizRetry}>
                        <RefreshCcw size={18} />
                        Refazer quiz
                      </button>
                      <button
                        className="btn-primary"
                        onClick={() => navigate(`/sector/${training.departmentId}`)}
                        style={{ backgroundColor: department?.color }}
                      >
                        <CheckCircle size={20} />
                        Voltar ao setor
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="training-detail-empty">
                <p>Esse treinamento ainda não possui quiz cadastrado.</p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default TrainingDetail;
