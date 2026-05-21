import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  FileText,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { sectorsData } from '../data/sectorsData';
import { getModulesForSector } from '../data/trainingCatalog';
import { canManageSector, getUserDepartmentIds, isSuperAdmin } from '../data/sectorAccess';
import {
  createTraining,
  deleteTraining,
  extractTrainingPdf,
  fetchTrainings,
  getCachedTrainings,
  updateTraining,
} from '../data/trainingAdminApi';
import './AdminTrainings.css';

const resolveModuleId = (titleOrId, departmentId) => {
  const modules = getModulesForSector(departmentId);
  const matched = modules.find(
    (m) => String(m.title).trim().toLowerCase() === String(titleOrId).trim().toLowerCase()
  );
  if (matched) {
    return String(matched.id);
  }
  const matchedById = modules.find(
    (m) => String(m.id).trim().toLowerCase() === String(titleOrId).trim().toLowerCase()
  );
  if (matchedById) {
    return String(matchedById.id);
  }
  return titleOrId;
};

const getModuleDisplayValue = (moduleId, departmentId) => {
  const sectorModules = getModulesForSector(departmentId);
  const matched = sectorModules.find((m) => String(m.id) === String(moduleId));
  return matched ? matched.title : (moduleId || '');
};

const emptyForm = (departmentId) => {
  const modules = getModulesForSector(departmentId);
  const defaultModuleTitle = modules.length > 0 ? String(modules[0].title) : '';
  return {
    level: 'basico',
    status: 'published',
    departmentId,
    moduleId: defaultModuleTitle,
  };
};

const getDepartmentTitle = (departmentId) => (
  sectorsData.find((sector) => sector.id === departmentId)?.title ?? departmentId
);

const safeText = (value, maxLength = 12000) => (
  typeof value === 'string'
    ? value.slice(0, maxLength)
    : ''
);

const normalizeQuizQuestions = (questions = []) => (
  Array.isArray(questions)
    ? questions
        .map((question, index) => {
          const questionText = safeText(question?.question, 240).trim();
          const options = Array.isArray(question?.options)
            ? question.options.map((option) => safeText(option, 140).trim()).filter(Boolean).slice(0, 4)
            : [];
          const answerIndex = Number.isInteger(question?.answerIndex)
            ? question.answerIndex
            : Number.parseInt(question?.answerIndex, 10);
          const explanation = safeText(question?.explanation, 500).trim();

          if (!questionText || options.length < 2 || !Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex >= options.length) {
            return null;
          }

          return {
            id: String(question?.id ?? `q-${index + 1}`),
            question: questionText,
            options,
            answerIndex,
            explanation,
          };
        })
        .filter(Boolean)
        .slice(0, 20)
    : []
);

const AdminTrainings = ({ currentUser }) => {
  const navigate = useNavigate();
  const isMaster = isSuperAdmin(currentUser);
  const accessibleDepartments = useMemo(() => (
    isMaster
      ? sectorsData
      : sectorsData.filter((sector) => getUserDepartmentIds(currentUser).includes(sector.id))
  ), [currentUser, isMaster]);
  const defaultDepartmentId = accessibleDepartments[0]?.id ?? 'marketing-produtos';
  const [trainings, setTrainings] = useState(() => getCachedTrainings());
  const [catalogDepartmentId, setCatalogDepartmentId] = useState(
    isMaster || accessibleDepartments.length > 1 ? 'all' : defaultDepartmentId
  );
  const [formData, setFormData] = useState(() => emptyForm(defaultDepartmentId));
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [extractionPreview, setExtractionPreview] = useState(null);
  const [extractingPdf, setExtractingPdf] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [editingTrainingId, setEditingTrainingId] = useState(null);
  const [descMode, setDescMode] = useState('preview'); // 'edit' or 'preview'
  const [contentMode, setContentMode] = useState('preview'); // 'edit' or 'preview'

  const handleStartEdit = (training) => {
    setEditingTrainingId(training.id);
    const displayModule = getModuleDisplayValue(training.moduleId, training.departmentId);
    setFormData({
      level: training.level,
      status: training.status,
      departmentId: training.departmentId,
      moduleId: displayModule,
    });
    setExtractionPreview({
      title: training.title,
      description: training.description,
      content: training.content,
      quizQuestions: training.quizQuestions || [],
      status: 'organized',
    });
    setFeedback({ type: '', message: '' });
    
    const formElement = document.querySelector('.training-form-panel');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleUpdateQuestionText = (qIndex, value) => {
    setExtractionPreview((prev) => {
      if (!prev) return prev;
      const updated = [...prev.quizQuestions];
      updated[qIndex] = { ...updated[qIndex], question: value };
      return { ...prev, quizQuestions: updated };
    });
  };

  const handleUpdateOptionText = (qIndex, oIndex, value) => {
    setExtractionPreview((prev) => {
      if (!prev) return prev;
      const updated = [...prev.quizQuestions];
      const updatedOptions = [...updated[qIndex].options];
      updatedOptions[oIndex] = value;
      updated[qIndex] = { ...updated[qIndex], options: updatedOptions };
      return { ...prev, quizQuestions: updated };
    });
  };

  const handleUpdateAnswerIndex = (qIndex, value) => {
    setExtractionPreview((prev) => {
      if (!prev) return prev;
      const updated = [...prev.quizQuestions];
      updated[qIndex] = { ...updated[qIndex], answerIndex: Number(value) };
      return { ...prev, quizQuestions: updated };
    });
  };

  const handleUpdateExplanation = (qIndex, value) => {
    setExtractionPreview((prev) => {
      if (!prev) return prev;
      const updated = [...prev.quizQuestions];
      updated[qIndex] = { ...updated[qIndex], explanation: value };
      return { ...prev, quizQuestions: updated };
    });
  };

  const handleRemoveQuestion = (qIndex) => {
    setExtractionPreview((prev) => {
      if (!prev) return prev;
      const updated = prev.quizQuestions.filter((_, idx) => idx !== qIndex);
      return { ...prev, quizQuestions: updated };
    });
  };

  const handleAddQuestion = () => {
    setExtractionPreview((prev) => {
      if (!prev) return prev;
      const newQuestion = {
        id: `q-${Date.now()}`,
        question: 'Nova pergunta do quiz',
        options: ['Opção 1', 'Opção 2', 'Opção 3', 'Opção 4'],
        answerIndex: 0,
        explanation: '',
      };
      return { ...prev, quizQuestions: [...prev.quizQuestions, newQuestion] };
    });
  };

  useEffect(() => {
    let cancelled = false;

    fetchTrainings()
      .then((items) => {
        if (!cancelled) {
          setTrainings(items);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setFeedback({ type: 'error', message: error.message });
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const visibleTrainings = useMemo(() => (
    trainings
      .filter((training) => canManageSector(currentUser, training.departmentId))
      .filter((training) => catalogDepartmentId === 'all' || training.departmentId === catalogDepartmentId)
  ), [catalogDepartmentId, currentUser, trainings]);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => {
      const updated = { ...current, [name]: value };
      if (name === 'departmentId') {
        const sectorModules = getModulesForSector(value);
        updated.moduleId = sectorModules.length > 0 ? String(sectorModules[0].title) : '';
      }
      return updated;
    });
  };

  const normalizeExtractedSuggestion = (suggestion = {}) => ({
    title: safeText(suggestion.title, 120),
    description: safeText(suggestion.description, 500),
    content: safeText(suggestion.content, 10000),
    quizQuestions: normalizeQuizQuestions(suggestion.quizQuestions),
  });

  const handlePdfChange = (event) => {
    const file = event.target.files?.[0] ?? null;

    if (file && file.type !== 'application/pdf') {
      setFeedback({ type: 'error', message: 'Selecione um arquivo PDF.' });
      event.target.value = '';
      return;
    }

    setSelectedPdf(file);
    setExtractionPreview(null);
    setFeedback({ type: '', message: '' });
  };

  const handleExtractPdf = async () => {
    if (!selectedPdf) {
      setFeedback({ type: 'error', message: 'Selecione um PDF para extrair.' });
      return;
    }

    if (!canManageSector(currentUser, formData.departmentId)) {
      setFeedback({ type: 'error', message: 'Você só pode enviar PDF do seu departamento.' });
      return;
    }

    setExtractingPdf(true);

    try {
      const payload = await extractTrainingPdf({
        file: selectedPdf,
        departmentId: formData.departmentId,
      });
      const suggestion = normalizeExtractedSuggestion(payload.suggestion);

      setExtractionPreview({
        ...suggestion,
        status: payload.status,
        organizationStatus: payload.organizationStatus,
      });
      setFeedback({
        type: 'success',
        message: payload.status === 'organized'
          ? 'PDF lido e organizado pela IA. Confira a prévia antes de cadastrar.'
          : payload.status === 'configuration_missing'
            ? 'PDF enviado. Configure a API no backend para gerar a prévia automaticamente.'
            : 'PDF lido. Confira a prévia antes de cadastrar.',
      });
    } catch (error) {
      setFeedback({ type: 'error', message: error.message });
    } finally {
      setExtractingPdf(false);
    }
  };

  const resetForm = () => {
    setExtractionPreview(null);
    setSelectedPdf(null);
    setFileInputKey((current) => current + 1);
    setFormData(emptyForm(defaultDepartmentId));
    setEditingTrainingId(null);
  };

  const handleCatalogDepartmentFilterChange = (event) => {
    const nextDepartmentId = event.target.value;
    setCatalogDepartmentId(nextDepartmentId);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!canManageSector(currentUser, formData.departmentId)) {
      setFeedback({ type: 'error', message: 'Você só pode gerenciar treinamentos no seu departamento.' });
      return;
    }

    if (!extractionPreview) {
      setFeedback({ type: 'error', message: 'Preencha os dados do treinamento ou extraia de um PDF antes de salvar.' });
      return;
    }

    const resolvedModuleId = resolveModuleId(formData.moduleId, formData.departmentId);
    const trainingPayload = {
      ...formData,
      moduleId: resolvedModuleId,
      title: extractionPreview.title,
      description: extractionPreview.description,
      content: extractionPreview.content,
      quizQuestions: extractionPreview.quizQuestions,
    };

    if (!trainingPayload.title?.trim()) {
      setFeedback({ type: 'error', message: 'Por favor, insira o título do treinamento.' });
      return;
    }

    if (!trainingPayload.content?.trim()) {
      setFeedback({ type: 'error', message: 'Por favor, insira o conteúdo do treinamento.' });
      return;
    }

    if (!Array.isArray(trainingPayload.quizQuestions) || trainingPayload.quizQuestions.length < 10) {
      setFeedback({ type: 'error', message: 'O quiz do treinamento precisa ter pelo menos dez perguntas.' });
      return;
    }

    try {
      let savedTraining;
      if (editingTrainingId) {
        savedTraining = await updateTraining(editingTrainingId, trainingPayload);
        setFeedback({
          type: 'success',
          message: 'Treinamento atualizado com sucesso.',
        });
      } else {
        savedTraining = await createTraining(trainingPayload);
        setFeedback({
          type: 'success',
          message: 'Treinamento cadastrado a partir da prévia da IA.',
        });
      }

      const items = await fetchTrainings();
      setTrainings(items);
      setCatalogDepartmentId(savedTraining.departmentId);

      setSelectedPdf(null);
      setFileInputKey((current) => current + 1);
      setExtractionPreview(null);
      setFormData(emptyForm(savedTraining.departmentId));
      setEditingTrainingId(null);
    } catch (error) {
      setFeedback({ type: 'error', message: error.message });
    }
  };

  const handleDelete = async (training) => {
    if (!canManageSector(currentUser, training.departmentId)) {
      setFeedback({ type: 'error', message: 'Você só pode remover treinamentos do seu departamento.' });
      return;
    }

    try {
      const items = await deleteTraining(training.id);
      setTrainings(items);
      setFeedback({ type: 'success', message: 'Treinamento removido.' });
    } catch (error) {
      setFeedback({ type: 'error', message: error.message });
    }
  };

  return (
    <div className="admin-trainings-wrapper animate-fade-in">
      <header className="admin-trainings-header glass-panel">
        <div className="container admin-trainings-header-content">
          <button className="btn-back" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={22} />
            <span>Voltar</span>
          </button>
          <div className="admin-trainings-title">
            <BookOpen size={28} color="var(--accent-color)" />
            <h2>Gerenciar treinamentos</h2>
          </div>
        </div>
      </header>

      <main className="container admin-trainings-main">
        <section className="admin-trainings-summary glass-panel">
          <div>
            <span className="section-kicker">{isMaster ? 'Master' : 'Admin de departamento'}</span>
            <h1>Treinamentos por departamento</h1>
            <p>Envie PDFs, confira a organização feita pela IA e publique treinamentos no departamento correto.</p>
          </div>
          <label>
            Filtrar catálogo
            <select
              className="input-field"
              value={catalogDepartmentId}
              onChange={handleCatalogDepartmentFilterChange}
              disabled={accessibleDepartments.length <= 1}
            >
              {(isMaster || accessibleDepartments.length > 1) && (
                <option value="all">Todos os departamentos</option>
              )}
              {accessibleDepartments.map((sector) => (
                <option key={sector.id} value={sector.id}>
                  {sector.title}
                </option>
              ))}
            </select>
          </label>
        </section>

        <div className="admin-trainings-layout">
          <section className="training-form-panel glass-panel">
            <div className="panel-heading">
              <FileText size={22} color="var(--accent-color)" />
              <h3>{editingTrainingId ? 'Editar treinamento' : 'Novo treinamento com IA'}</h3>
            </div>

            <form className="training-form" onSubmit={handleSubmit}>
              <div className="training-ai-controls">
                <div className="training-selectors-column" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label className="training-department-card">
                    <span className="field-label">Área / Departamento do Treinamento</span>
                    <p className="field-hint">Escolha qual área e departamento deseja inserir o treinamento.</p>
                    <select
                      className="input-field"
                      name="departmentId"
                      value={formData.departmentId}
                      onChange={handleFieldChange}
                      disabled={accessibleDepartments.length <= 1}
                    >
                      {accessibleDepartments.map((sector) => (
                        <option key={sector.id} value={sector.id}>
                          {sector.title}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="training-department-card">
                    <span className="field-label">Produto / Módulo</span>
                    <p className="field-hint">Digite um novo nome ou selecione uma opção sugerida.</p>
                    <input
                      type="text"
                      className="input-field"
                      name="moduleId"
                      list="dynamic-modules-list"
                      value={formData.moduleId}
                      onChange={handleFieldChange}
                      placeholder="Ex: Baterias, Recebimento, ou digite um novo nome..."
                      required
                    />
                    <datalist id="dynamic-modules-list">
                      {getModulesForSector(formData.departmentId).map((module) => (
                        <option key={module.id} value={module.title} />
                      ))}
                    </datalist>
                  </label>

                  <label className="training-department-card">
                    <span className="field-label">Nível de Treinamento</span>
                    <p className="field-hint">Escolha qual nível de treinamento deseja atribuir.</p>
                    <select
                      className="input-field"
                      name="level"
                      value={formData.level}
                      onChange={handleFieldChange}
                    >
                      <option value="basico">Básico</option>
                      <option value="intermediario">Intermediário</option>
                      <option value="avancado">Avançado</option>
                    </select>
                  </label>
                </div>

                <div className="pdf-upload-box">
                  <div>
                    <span className="field-label">PDF do treinamento</span>
                    <p className="field-hint">A IA vai extrair e organizar título, descrição e conteúdo.</p>
                  </div>
                  <div className="pdf-upload-actions">
                    <label className="pdf-file-button">
                      <Upload size={17} />
                      <span>{selectedPdf ? selectedPdf.name : 'Selecionar PDF'}</span>
                      <input key={fileInputKey} type="file" accept="application/pdf" onChange={handlePdfChange} disabled={!!editingTrainingId} />
                    </label>
                    <button
                      type="button"
                      className="btn-outline"
                      onClick={handleExtractPdf}
                      disabled={!selectedPdf || extractingPdf || !!editingTrainingId}
                    >
                      {extractingPdf ? <Loader2 size={17} className="spin-icon" /> : <FileText size={17} />}
                      Extrair dados
                    </button>
                  </div>
                </div>
              </div>

              {extractionPreview && (
                <section className="extraction-preview">
                  <div className="extraction-preview-header">
                    <div>
                      <span className="section-kicker">{editingTrainingId ? 'Editando Treinamento' : 'Prévia da IA'}</span>
                      <h4>{editingTrainingId ? 'Ajustes Finos' : 'Confira e ajuste antes de salvar'}</h4>
                    </div>
                    <span className={`training-status ${editingTrainingId ? 'draft' : 'published'}`}>
                      {editingTrainingId ? 'Modo Edição' : 'Pronto para salvar'}
                    </span>
                  </div>

                  <div className="ai-preview-block">
                    <span>Título do Treinamento</span>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Digite o título do treinamento..."
                      value={extractionPreview.title || ''}
                      onChange={(e) => setExtractionPreview(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  <div className="ai-preview-block">
                    <div className="ai-preview-block-header">
                      <span>Descrição / Resumo</span>
                      <div className="toggle-preview-buttons">
                        <button
                          type="button"
                          className={`btn-toggle-small ${descMode === 'edit' ? 'active' : ''}`}
                          onClick={() => setDescMode('edit')}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className={`btn-toggle-small ${descMode === 'preview' ? 'active' : ''}`}
                          onClick={() => setDescMode('preview')}
                        >
                          Visualizar
                        </button>
                      </div>
                    </div>
                    {descMode === 'edit' ? (
                      <textarea
                        className="input-field"
                        placeholder="Digite o resumo do treinamento..."
                        value={extractionPreview.description || ''}
                        onChange={(e) => setExtractionPreview(prev => ({ ...prev, description: e.target.value }))}
                      />
                    ) : (
                      <div className="markdown-preview">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {extractionPreview.description ? extractionPreview.description.replace(/\\n/g, '\n') : 'Sem resumo cadastrado.'}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>

                  <div className="ai-preview-block content">
                    <div className="ai-preview-block-header">
                      <span>Conteúdo Organizado</span>
                      <div className="toggle-preview-buttons">
                        <button
                          type="button"
                          className={`btn-toggle-small ${contentMode === 'edit' ? 'active' : ''}`}
                          onClick={() => setContentMode('edit')}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className={`btn-toggle-small ${contentMode === 'preview' ? 'active' : ''}`}
                          onClick={() => setContentMode('preview')}
                        >
                          Visualizar
                        </button>
                      </div>
                    </div>
                    {contentMode === 'edit' ? (
                      <textarea
                        className="input-field"
                        name="content"
                        placeholder="Digite o conteúdo do treinamento (suporta Markdown)..."
                        value={extractionPreview.content || ''}
                        onChange={(e) => setExtractionPreview(prev => ({ ...prev, content: e.target.value }))}
                      />
                    ) : (
                      <div className="markdown-preview">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {extractionPreview.content ? extractionPreview.content.replace(/\\n/g, '\n') : 'Sem conteúdo cadastrado.'}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>

                  <div className="ai-preview-block content">
                    <div className="ai-preview-block-header">
                      <span>Quiz Sugerido</span>
                      <button
                        type="button"
                        className="btn-outline btn-add-question"
                        onClick={handleAddQuestion}
                      >
                        <Plus size={14} />
                        Adicionar Pergunta
                      </button>
                    </div>
                    <div className="quiz-preview-list">
                      {extractionPreview.quizQuestions.map((question, qIndex) => (
                        <article key={question.id ?? qIndex} className="quiz-preview-card edit-mode">
                          <div className="quiz-card-header">
                            <strong>Pergunta {qIndex + 1}</strong>
                            <button
                              type="button"
                              className="btn-remove-question"
                              onClick={() => handleRemoveQuestion(qIndex)}
                              title="Remover pergunta"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          
                          <div className="quiz-field-group">
                            <label className="quiz-input-label">
                              Enunciado
                              <input
                                type="text"
                                className="input-field quiz-edit-input"
                                value={question.question}
                                onChange={(e) => handleUpdateQuestionText(qIndex, e.target.value)}
                                placeholder="Ex: Qual é a função da bateria de notebook?"
                              />
                            </label>
                          </div>

                          <div className="quiz-options-grid">
                            {Array.from({ length: 4 }).map((_, oIndex) => {
                              const optionVal = question.options[oIndex] ?? '';
                              return (
                                <label key={oIndex} className="quiz-input-label">
                                  Opção {String.fromCharCode(65 + oIndex)}
                                  <input
                                    type="text"
                                    className="input-field quiz-edit-input"
                                    value={optionVal}
                                    onChange={(e) => handleUpdateOptionText(qIndex, oIndex, e.target.value)}
                                    placeholder={`Opção ${oIndex + 1}`}
                                  />
                                </label>
                              );
                            })}
                          </div>

                          <div className="quiz-meta-row">
                            <label className="quiz-input-label half">
                              Alternativa Correta
                              <select
                                className="input-field quiz-edit-select"
                                value={question.answerIndex}
                                onChange={(e) => handleUpdateAnswerIndex(qIndex, e.target.value)}
                              >
                                {question.options.map((option, oIndex) => (
                                  <option key={oIndex} value={oIndex}>
                                    Opção {String.fromCharCode(65 + oIndex)}: {option.slice(0, 40) || `Opção ${oIndex + 1}`}
                                  </option>
                                ))}
                              </select>
                            </label>

                            <label className="quiz-input-label half">
                              Explicação do Quiz
                              <input
                                type="text"
                                className="input-field quiz-edit-input"
                                value={question.explanation || ''}
                                onChange={(e) => handleUpdateExplanation(qIndex, e.target.value)}
                                placeholder="Explique por que esta alternativa é a correta..."
                              />
                            </label>
                          </div>
                        </article>
                      ))}
                      {!extractionPreview.quizQuestions.length && (
                        <p className="markdown-empty">Sem perguntas cadastradas. Adicione uma acima!</p>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {!extractionPreview && (
                <section className="ai-empty-preview">
                  <FileText size={22} />
                  <div>
                    <strong>A prévia do treinamento aparecerá aqui.</strong>
                    <p>Você pode extrair dados de um PDF ou clicar em "Editar" em qualquer treinamento cadastrado para visualizá-lo e alterá-lo aqui.</p>
                  </div>
                </section>
              )}

              {feedback.message && (
                <div className={`admin-training-feedback ${feedback.type}`}>
                  {feedback.type === 'success' && <CheckCircle size={18} />}
                  <span>{feedback.message}</span>
                </div>
              )}

              <div className="training-form-actions">
                <button type="button" className="btn-outline" onClick={resetForm}>
                  {editingTrainingId ? 'Cancelar' : 'Limpar'}
                </button>
                <button type="submit" className="btn-primary" disabled={!extractionPreview || extractingPdf}>
                  {editingTrainingId ? <CheckCircle size={18} /> : <Plus size={18} />}
                  {editingTrainingId ? 'Salvar Alterações' : 'Cadastrar Treinamento'}
                </button>
              </div>
            </form>
          </section>

          <section className="training-list-panel glass-panel">
            <div className="panel-heading spaced">
              <div>
                <span className="section-kicker">Catálogo</span>
                <h3>Treinamentos cadastrados</h3>
              </div>
              <span className="training-count">{visibleTrainings.length}</span>
            </div>

            <div className="training-list">
              {loading && <div className="training-empty">Carregando treinamentos...</div>}

              {!loading && visibleTrainings.map((training) => (
                <article key={training.id} className="training-row">
                  <div>
                    <div className="training-row-header">
                      <strong>{training.title}</strong>
                      <span className={`training-status ${training.status}`}>
                        {training.status === 'published' ? 'Publicado' : 'Rascunho'}
                      </span>
                    </div>
                    <div className="training-row-description">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {training.description ? training.description.replace(/\\n/g, '\n') : 'Sem descrição.'}
                      </ReactMarkdown>
                    </div>
                    <small>
                      {getDepartmentTitle(training.departmentId)}
                      {' · '}
                      {training.level === 'basico' ? 'Básico' : training.level === 'intermediario' ? 'Intermediário' : 'Avançado'}
                    </small>
                  </div>
                  <div className="training-row-actions">
                    <button type="button" className="btn-small btn-primary-ghost" onClick={() => handleStartEdit(training)}>
                      <Pencil size={15} />
                      Editar
                    </button>
                    <button type="button" className="btn-small btn-danger-ghost" onClick={() => handleDelete(training)}>
                      <Trash2 size={15} />
                      Remover
                    </button>
                  </div>
                </article>
              ))}

              {!loading && !visibleTrainings.length && (
                <div className="training-empty">Nenhum treinamento cadastrado neste departamento.</div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminTrainings;
