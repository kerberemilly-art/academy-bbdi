import { useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ChevronRight, ChevronLeft, Award, RefreshCcw } from 'lucide-react';
import { modulesData } from '../data/modulesData';
import { getMarketingLevelStatus } from '../data/trainingPath';

import { recordQuizResult } from '../api/progressStorage';
import { issueQuizCertificate } from '../data/certificateActions';
import './Lesson.css';
import Confetti from '../components/Confetti';
import StudyMentor from '../components/StudyMentor';

const Lesson = ({ currentUser }) => {
  const { moduleId, levelId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const backPath = location.state?.backPath || '/dashboard';
  
  const moduleInfo = modulesData[moduleId];
  const levelInfo = moduleInfo?.levels.find(l => l.id === levelId);
  const lesson = levelInfo?.lesson;
  const levelStatus = getMarketingLevelStatus(currentUser, moduleId, levelId);

  const [currentStep, setCurrentStep] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  if (!lesson) return <div className="container" style={{padding: '2rem'}}>Aula não encontrada.</div>;

  if (currentUser?.role !== 'master' && currentUser?.role !== 'admin' && levelStatus.isLocked) {
    const requiredModuleTitle = levelStatus.requiredModuleId
      ? modulesData[levelStatus.requiredModuleId]?.title
      : 'o módulo anterior';
    const requiredLevelTitle = levelStatus.requiredLevelId
      ? modulesData[levelStatus.requiredModuleId]?.levels.find((level) => level.id === levelStatus.requiredLevelId)?.title
      : null;

    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Você ainda não pode acessar esta aula.</h2>
        <p style={{ marginTop: '12px' }}>
          {requiredLevelTitle
            ? `Conclua ${requiredLevelTitle} em ${requiredModuleTitle} para liberar esta aula.`
            : `Conclua ${requiredModuleTitle} para liberar ${moduleInfo?.title ?? 'esta aula'}.`}
        </p>
        <button className="btn-primary" onClick={() => navigate(backPath)} style={{ marginTop: '20px' }}>
          Voltar
        </button>
      </div>
    );
  }

  const handleNext = () => {
    if (currentStep < lesson.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowQuiz(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleAnswerSelect = (questionId, optionIndex) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleQuizSubmit = () => {
    const finalScore = calculateScore();
    const result = recordQuizResult({
      user: currentUser,
      moduleId,
      moduleTitle: moduleInfo.title,
      levelId,
      levelTitle: levelInfo.title,
      quizTitle: lesson.quiz.title,
      score: finalScore,
      totalQuestions: lesson.quiz.questions.length,
    });

    if (result) {
      const certificate = issueQuizCertificate(currentUser, result);

      if (certificate) {
        navigate('/certificate');
        return;
      }
    }

    setQuizSubmitted(true);
  };

  const handleQuizRetry = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const calculateScore = () => {
    let correct = 0;
    lesson.quiz.questions.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) correct++;
    });
    return correct;
  };

  const answeredCount = Object.keys(quizAnswers).length;
  const totalQuestions = lesson.quiz.questions.length;
  const score = calculateScore();
  const scorePercent = Math.round((score / totalQuestions) * 100);
  const currentLessonStep = lesson.steps[currentStep];

  const renderStepImages = () => {
    if (!currentLessonStep.image) return null;

    const images = Array.isArray(currentLessonStep.image)
      ? currentLessonStep.image
      : [currentLessonStep.image];

    return (
      <div className="step-image-container">
        {images.map((img, index) => (
          <div key={img} className="step-image">
            <img src={img} alt={`${currentLessonStep.title} - ${index + 1}`} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="lesson-wrapper">
      <header className="lesson-header glass-panel">
        <div className="container">
          <button className="btn-back" onClick={() => navigate(`/module/${moduleId}`, { state: { backPath } })}>
            <ChevronLeft size={20} /> Voltar para Níveis
          </button>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill"
              style={{ 
                width: `${showQuiz ? 100 : ((currentStep + 1) / (lesson.steps.length + 1)) * 100}%`,
                backgroundColor: moduleInfo.color 
              }}
            ></div>
          </div>
        </div>
      </header>

      <main className="container lesson-main animate-fade-in">
        {!showQuiz ? (
          <div className="lesson-content glass-panel">
            <span className="step-indicator" style={{ color: moduleInfo.color }}>
              Passo {currentStep + 1} de {lesson.steps.length}
            </span>
            <h2>{currentLessonStep.title}</h2>
            
            <div className="step-body">
              {currentLessonStep.imagePlacement !== 'afterContent' && renderStepImages()}
              {currentLessonStep.content.split('\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
              {currentLessonStep.imagePlacement === 'afterContent' && renderStepImages()}
            </div>

            <div className="lesson-actions">
              <button 
                className="btn-outline" 
                onClick={handlePrev} 
                disabled={currentStep === 0}
              >
                Anterior
              </button>
              <button 
                className="btn-primary" 
                style={{ backgroundColor: moduleInfo.color }}
                onClick={handleNext}
              >
                {currentStep === lesson.steps.length - 1 ? 'Ir para o Quiz' : 'Próximo'}
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div className="quiz-container glass-panel animate-fade-in">
            <div className="quiz-header">
              <h2>{lesson.quiz.title}</h2>
              <p>{answeredCount} de {totalQuestions} perguntas respondidas</p>
            </div>

            <div className="questions-list">
              {lesson.quiz.questions.map((q, qIndex) => {
                const selectedAnswer = quizAnswers[q.id];
                const isCorrect = selectedAnswer === q.correctAnswer;

                return (
                  <div key={q.id} className="question-card">
                    <h3>{qIndex + 1}. {q.question}</h3>
                    <div className="options-grid">
                      {q.options.map((opt, optIdx) => {
                        let optionClass = "quiz-option";
                        if (selectedAnswer === optIdx) optionClass += " selected";
                        
                        if (quizSubmitted) {
                          if (optIdx === q.correctAnswer) optionClass += " correct";
                          else if (selectedAnswer === optIdx) optionClass += " incorrect";
                        }

                        return (
                          <button 
                            key={optIdx}
                            className={optionClass}
                            onClick={() => handleAnswerSelect(q.id, optIdx)}
                            disabled={quizSubmitted}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className={`answer-feedback ${isCorrect ? 'is-correct' : 'is-incorrect'}`}>
                        <strong>{isCorrect ? 'Resposta correta.' : 'Revisar este ponto.'}</strong>
                        <span>{q.explanation}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!quizSubmitted ? (
              <button 
                className="btn-primary btn-submit-quiz"
                onClick={handleQuizSubmit}
                disabled={answeredCount < totalQuestions}
                style={{ backgroundColor: moduleInfo.color }}
              >
                Finalizar Quiz
              </button>
            ) : (
              <div className="quiz-results animate-fade-in">
                <Confetti active={quizSubmitted && scorePercent >= 60} />
                <div className="score-circle" style={{ borderColor: moduleInfo.color }}>
                  <Award size={40} color={moduleInfo.color} />
                  <span>{score} / {totalQuestions}</span>
                </div>
                <span className="score-percent">{scorePercent}% de aproveitamento</span>
                <h3>Quiz Concluído!</h3>
                <p>Ótimo trabalho! Você finalizou este nível de treinamento.</p>
                <div className="lesson-actions" style={{ marginBottom: '16px' }}>
                  <button type="button" className="btn-secondary" onClick={() => navigate('/certificate')}>
                    Ver Meu Certificado
                  </button>
                </div>
                <div className="quiz-result-actions">
                  <button 
                    className="btn-outline"
                    onClick={handleQuizRetry}
                  >
                    <RefreshCcw size={18} /> Refazer Quiz
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={() => navigate(`/module/${moduleId}`, { state: { backPath } })}
                    style={{ backgroundColor: moduleInfo.color }}
                  >
                    <CheckCircle size={20} /> Voltar ao Módulo
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      <StudyMentor lessonContent={currentLessonStep?.content || ''} />
    </div>
  );
};

export default Lesson;
