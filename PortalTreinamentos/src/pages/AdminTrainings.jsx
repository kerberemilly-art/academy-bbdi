import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Bold,
  CheckCircle,
  Copy,
  FileText,
  GripVertical,
  Image,
  Italic,
  Link,
  List,
  Loader2,
  Pencil,
  Plus,
  Table,
  Trash2,
  Type,
  Upload,
  Video,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ContentBlockRenderer from '../components/ContentBlockRenderer';
import {
  contentBlocksToMarkdown,
  createContentBlock,
  getSafeEmbedUrl,
  normalizeContentBlocks,
  sanitizeHtml,
} from '../data/contentBlocks';
import {
  getBuiltinTrainings,
  getEditableContentBlocks,
  markdownToContentBlocks,
} from '../data/adminTrainingCatalog';
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
  uploadTrainingImage,
} from '../api/trainingAdminApi';
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
    customLevel: '',
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
          const questionText = safeText(question?.question, 400).trim();
          const options = Array.isArray(question?.options)
            ? question.options.map((opt) => safeText(opt, 200).trim()).filter(Boolean)
            : [];
          const answerIndex = Number(question?.answerIndex);
          const explanation = safeText(question?.explanation, 600).trim();

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

const blockMenu = [
  { type: 'title', label: 'Titulo', icon: Type },
  { type: 'richText', label: 'Rich text', icon: FileText },
  { type: 'image', label: 'Imagem', icon: Image },
  { type: 'link', label: 'Link', icon: Link },
  { type: 'table', label: 'Tabela', icon: Table },
  { type: 'videoEmbed', label: 'Video', icon: Video },
];

const richTextCommand = (command, value = null) => {
  document.execCommand(command, false, value);
};

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
  const [editingCatalogTraining, setEditingCatalogTraining] = useState(null);
  const [descMode, setDescMode] = useState('preview'); // 'edit' or 'preview'
  const [contentMode, setContentMode] = useState('preview'); // 'edit' or 'preview'
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [dragState, setDragState] = useState(null);

  const handleStartEdit = (training) => {
    setEditingTrainingId(training.builtinSource ? null : training.id);
    setEditingCatalogTraining(training.builtinSource ? training : null);
    const displayModule = getModuleDisplayValue(training.moduleId, training.departmentId);
    
    const isCustomLevel = !['basico', 'intermediario', 'avancado'].includes(training.level);
    
    setFormData({
      level: isCustomLevel ? 'outro' : training.level,
      customLevel: isCustomLevel ? training.level : '',
      status: training.status,
      departmentId: training.departmentId,
      moduleId: displayModule,
    });
    setExtractionPreview({
      title: training.title,
      description: training.description,
      content: training.content,
      contentBlocks: getEditableContentBlocks(training),
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


  const getPreviewBlocks = (preview) => getEditableContentBlocks(preview);

  const setPreviewBlocks = (updater) => {
    setExtractionPreview((prev) => {
      if (!prev) return prev;
      const currentBlocks = getPreviewBlocks(prev);
      const nextBlocks = updater(currentBlocks);
      return {
        ...prev,
        contentBlocks: nextBlocks,
        content: contentBlocksToMarkdown(nextBlocks, prev.content),
      };
    });
  };

  const handleUpdateContentBlock = (blockId, propsUpdates) => {
    setPreviewBlocks((blocks) => blocks.map((block) => (
      block.id === blockId
        ? { ...block, props: { ...block.props, ...propsUpdates } }
        : block
    )));
  };

  const handleAddContentBlock = (type = 'richText', insertIndex) => {
    const nextBlock = createContentBlock(type);
    setPreviewBlocks((blocks) => {
      const nextBlocks = [...blocks];
      const targetIndex = Number.isInteger(insertIndex) ? insertIndex : nextBlocks.length;
      nextBlocks.splice(targetIndex, 0, nextBlock);
      return nextBlocks;
    });
    setSelectedBlockId(nextBlock.id);
    setContentMode('edit');
  };

  const handleDuplicateContentBlock = (blockId) => {
    setPreviewBlocks((blocks) => {
      const sourceIndex = blocks.findIndex((block) => block.id === blockId);
      if (sourceIndex < 0) return blocks;
      const copy = createContentBlock(blocks[sourceIndex].type, blocks[sourceIndex].props);
      const nextBlocks = [...blocks];
      nextBlocks.splice(sourceIndex + 1, 0, copy);
      setSelectedBlockId(copy.id);
      return nextBlocks;
    });
  };

  const handleMoveContentBlock = (fromIndex, toIndex) => {
    setPreviewBlocks((blocks) => {
      if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= blocks.length || toIndex >= blocks.length) {
        return blocks;
      }
      const nextBlocks = [...blocks];
      const [movedBlock] = nextBlocks.splice(fromIndex, 1);
      nextBlocks.splice(toIndex, 0, movedBlock);
      return nextBlocks;
    });
  };

  const handleRemoveContentBlock = (blockId) => {
    setPreviewBlocks((blocks) => blocks.filter((block) => block.id !== blockId));
    setSelectedBlockId((current) => (current === blockId ? null : current));
  };

  const handleDropOnCanvas = (event, dropIndex) => {
    event.preventDefault();
    const payload = dragState ?? JSON.parse(event.dataTransfer.getData('application/json') || 'null');
    setDragState(null);

    if (!payload) return;

    if (payload.kind === 'new-block') {
      handleAddContentBlock(payload.type, dropIndex);
      return;
    }

    if (payload.kind === 'existing-block') {
      handleMoveContentBlock(payload.index, dropIndex);
    }
  };

  const handleTrainingImageUpload = async (event, blockId) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = '';

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFeedback({ type: 'error', message: 'Selecione uma imagem válida.' });
      return;
    }

    setUploadingImage(true);
    setFeedback({ type: '', message: '' });

    try {
      const asset = await uploadTrainingImage(file);
      handleUpdateContentBlock(blockId, {
        imageUrl: asset.url,
        imageAlt: file.name.replace(/\.[^.]+$/, ''),
      });
      setContentMode('preview');
      setFeedback({ type: 'success', message: 'Imagem inserida no bloco do treinamento.' });
    } catch (error) {
      setFeedback({ type: 'error', message: error.message });
    } finally {
      setUploadingImage(false);
    }
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

  const builtinTrainings = useMemo(() => getBuiltinTrainings(accessibleDepartments), [accessibleDepartments]);
  const editableTrainings = useMemo(() => {
    const customSourceKeys = new Set(
      trainings.map((training) => `${training.departmentId}:${String(training.moduleId)}:${training.level}`)
    );
    const pendingBuiltinTrainings = builtinTrainings.filter(
      (training) => !customSourceKeys.has(`${training.departmentId}:${String(training.moduleId)}:${training.level}`)
    );

    return [...trainings, ...pendingBuiltinTrainings];
  }, [builtinTrainings, trainings]);

  const visibleTrainings = useMemo(() => (
    editableTrainings
      .filter((training) => canManageSector(currentUser, training.departmentId))
      .filter((training) => catalogDepartmentId === 'all' || training.departmentId === catalogDepartmentId)
  ), [catalogDepartmentId, currentUser, editableTrainings]);

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
        contentBlocks: markdownToContentBlocks(suggestion.content),
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
    setEditingCatalogTraining(null);
    setSelectedBlockId(null);
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
    const hasInvalidVideo = normalizeContentBlocks(extractionPreview.contentBlocks, extractionPreview.content)
      .some((block) => block.type === 'videoEmbed' && block.props.url && !getSafeEmbedUrl(block.props.url));
    if (hasInvalidVideo) {
      setFeedback({ type: 'error', message: 'Revise a URL do vídeo. Use YouTube, Vimeo ou embed aceito.' });
      return;
    }
    const normalizedContentBlocks = normalizeContentBlocks(extractionPreview.contentBlocks, extractionPreview.content);
    const trainingPayload = {
      ...formData,
      level: formData.level === 'outro' ? formData.customLevel : formData.level,
      moduleId: resolvedModuleId,
      title: extractionPreview.title,
      description: extractionPreview.description,
      content: contentBlocksToMarkdown(normalizedContentBlocks, extractionPreview.content),
      contentBlocks: normalizedContentBlocks,
      quizQuestions: extractionPreview.quizQuestions,
      catalogImport: Boolean(editingCatalogTraining),
    };
    
    // Remover property temporária do customLevel
    delete trainingPayload.customLevel;

    if (!trainingPayload.title?.trim()) {
      setFeedback({ type: 'error', message: 'Por favor, insira o título do treinamento.' });
      return;
    }

    if (!trainingPayload.content?.trim() && !trainingPayload.contentBlocks?.length) {
      setFeedback({ type: 'error', message: 'Por favor, insira o conteúdo do treinamento.' });
      return;
    }

    const minimumQuizQuestions = editingCatalogTraining ? 8 : 10;
    if (!Array.isArray(trainingPayload.quizQuestions) || trainingPayload.quizQuestions.length < minimumQuizQuestions) {
      setFeedback({
        type: 'error',
        message: editingCatalogTraining
          ? 'O quiz do treinamento nativo precisa manter pelo menos oito perguntas.'
          : 'O quiz do treinamento precisa ter pelo menos dez perguntas.',
      });
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
      setEditingCatalogTraining(null);
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

  const builderBlocks = getEditableContentBlocks(extractionPreview);

  const handleRichTextInput = (blockId, event) => {
    handleUpdateContentBlock(blockId, { content: sanitizeHtml(event.currentTarget.innerHTML) });
  };

  const handleTableCellChange = (block, rowIndex, columnIndex, value) => {
    const columns = block.props.columns ?? [];
    const rows = block.props.rows ?? [];
    const nextRows = rows.map((row, currentRow) => (
      currentRow === rowIndex
        ? columns.map((_, currentColumn) => (currentColumn === columnIndex ? value : row?.[currentColumn] ?? ''))
        : row
    ));
    handleUpdateContentBlock(block.id, { rows: nextRows });
  };

  const handleTableColumnChange = (block, columnIndex, value) => {
    const nextColumns = (block.props.columns ?? []).map((column, currentColumn) => (
      currentColumn === columnIndex ? value : column
    ));
    handleUpdateContentBlock(block.id, { columns: nextColumns });
  };

  const handleAddTableRow = (block) => {
    const columns = block.props.columns ?? [];
    handleUpdateContentBlock(block.id, { rows: [...(block.props.rows ?? []), columns.map(() => '')] });
  };

  const handleAddTableColumn = (block) => {
    const columns = [...(block.props.columns ?? []), `Coluna ${(block.props.columns?.length ?? 0) + 1}`];
    const rows = (block.props.rows ?? []).map((row) => [...row, '']);
    handleUpdateContentBlock(block.id, { columns, rows });
  };

  const handleRemoveTableRow = (block, rowIndex) => {
    const rows = (block.props.rows ?? []).filter((_, currentRow) => currentRow !== rowIndex);
    handleUpdateContentBlock(block.id, { rows: rows.length ? rows : [(block.props.columns ?? []).map(() => '')] });
  };

  const handleRemoveTableColumn = (block, columnIndex) => {
    const currentColumns = block.props.columns ?? [];
    if (currentColumns.length <= 1) return;
    const columns = currentColumns.filter((_, currentColumn) => currentColumn !== columnIndex);
    const rows = (block.props.rows ?? []).map((row) => row.filter((_, currentColumn) => currentColumn !== columnIndex));
    handleUpdateContentBlock(block.id, { columns, rows });
  };

  const renderBuilderPreview = (block) => {
    if (block.type === 'image' && !block.props.imageUrl) return <div className="builder-draft-placeholder"><Image size={18} /> Configure a imagem</div>;
    if (block.type === 'link' && !block.props.url) return <div className="builder-draft-placeholder"><Link size={18} /> Configure o link</div>;
    if (block.type === 'videoEmbed' && !block.props.url) return <div className="builder-draft-placeholder"><Video size={18} /> Configure o video</div>;
    return <ContentBlockRenderer blocks={[block]} fallbackContent="" className="builder-block-render" />;
  };

  const renderInlineBlockEditor = (block) => (
    <div className="builder-inline-editor" onClick={(event) => event.stopPropagation()}>
      <strong>Editar {blockMenu.find((item) => item.type === block.type)?.label}</strong>

      {block.type === 'title' && (
        <>
          <label className="quiz-input-label">Texto
            <input className="input-field quiz-edit-input" value={block.props.text ?? ''} onChange={(event) => handleUpdateContentBlock(block.id, { text: event.target.value })} />
          </label>
          <label className="quiz-input-label">Nivel
            <select className="input-field" value={block.props.level ?? 2} onChange={(event) => handleUpdateContentBlock(block.id, { level: Number(event.target.value) })}>
              <option value={1}>H1</option>
              <option value={2}>H2</option>
              <option value={3}>H3</option>
            </select>
          </label>
        </>
      )}

      {block.type === 'richText' && (
        <>
          <div className="rich-text-toolbar">
            <button type="button" title="Negrito" onMouseDown={(event) => { event.preventDefault(); richTextCommand('bold'); }}><Bold size={14} /></button>
            <button type="button" title="Italico" onMouseDown={(event) => { event.preventDefault(); richTextCommand('italic'); }}><Italic size={14} /></button>
            <button type="button" title="Lista" onMouseDown={(event) => { event.preventDefault(); richTextCommand('insertUnorderedList'); }}><List size={14} /></button>
            <button type="button" title="Alinhar" onMouseDown={(event) => { event.preventDefault(); richTextCommand('justifyLeft'); }}>≡</button>
            <button type="button" title="Link" onMouseDown={(event) => { event.preventDefault(); const url = window.prompt('URL do link'); if (url) richTextCommand('createLink', url); }}><Link size={14} /></button>
          </div>
          <div
            className="rich-text-editor"
            contentEditable
            suppressContentEditableWarning
            onInput={(event) => handleRichTextInput(block.id, event)}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.props.content ?? '') }}
          />
        </>
      )}

      {block.type === 'image' && (
        <>
          <label className={`btn-outline btn-image-upload ${uploadingImage ? 'is-loading' : ''}`}>
            {uploadingImage ? <Loader2 size={15} className="spin-icon" /> : <Image size={15} />}
            <span>{block.props.imageUrl ? 'Trocar imagem' : 'Inserir imagem'}</span>
            <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(event) => handleTrainingImageUpload(event, block.id)} disabled={uploadingImage} />
          </label>
          <label className="quiz-input-label">URL da imagem
            <input className="input-field quiz-edit-input" value={block.props.imageUrl ?? ''} onChange={(event) => handleUpdateContentBlock(block.id, { imageUrl: event.target.value })} />
          </label>
          <label className="quiz-input-label">Texto alternativo
            <input className="input-field quiz-edit-input" value={block.props.imageAlt ?? ''} onChange={(event) => handleUpdateContentBlock(block.id, { imageAlt: event.target.value })} />
          </label>
        </>
      )}

      {block.type === 'link' && (
        <>
          <label className="quiz-input-label">Rotulo
            <input className="input-field quiz-edit-input" value={block.props.label ?? ''} onChange={(event) => handleUpdateContentBlock(block.id, { label: event.target.value })} />
          </label>
          <label className="quiz-input-label">URL
            <input className="input-field quiz-edit-input" value={block.props.url ?? ''} onChange={(event) => handleUpdateContentBlock(block.id, { url: event.target.value })} />
          </label>
        </>
      )}

      {block.type === 'table' && (
        <div className="table-editor">
          <div className="table-editor-actions">
            <button type="button" className="btn-outline" onClick={() => handleAddTableRow(block)}>Adicionar linha</button>
            <button type="button" className="btn-outline" onClick={() => handleAddTableColumn(block)}>Adicionar coluna</button>
          </div>
          {(block.props.columns ?? []).map((column, columnIndex) => (
            <div key={`col-${columnIndex}`} className="table-editor-row">
              <input className="input-field quiz-edit-input" value={column} onChange={(event) => handleTableColumnChange(block, columnIndex, event.target.value)} />
              <button type="button" className="btn-outline" onClick={() => handleRemoveTableColumn(block, columnIndex)}>Remover coluna</button>
            </div>
          ))}
          {(block.props.rows ?? []).map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="table-editor-row">
              {(block.props.columns ?? []).map((_, columnIndex) => (
                <input key={`cell-${rowIndex}-${columnIndex}`} className="input-field quiz-edit-input" value={row?.[columnIndex] ?? ''} onChange={(event) => handleTableCellChange(block, rowIndex, columnIndex, event.target.value)} />
              ))}
              <button type="button" className="btn-outline" onClick={() => handleRemoveTableRow(block, rowIndex)}>Remover linha</button>
            </div>
          ))}
        </div>
      )}

      {block.type === 'videoEmbed' && (
        <>
          <label className="quiz-input-label">Titulo
            <input className="input-field quiz-edit-input" value={block.props.title ?? ''} onChange={(event) => handleUpdateContentBlock(block.id, { title: event.target.value })} />
          </label>
          <label className="quiz-input-label">URL YouTube, Vimeo ou embed
            <input className="input-field quiz-edit-input" value={block.props.url ?? ''} onChange={(event) => handleUpdateContentBlock(block.id, { url: event.target.value })} />
          </label>
          {block.props.url && !getSafeEmbedUrl(block.props.url) && (
            <p className="field-error">Informe uma URL valida do YouTube, Vimeo ou embed aceito.</p>
          )}
        </>
      )}
    </div>
  );

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
                <div className="training-selectors-column">
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
                      <option value="outro">Outro (Novo Nível)...</option>
                    </select>
                    {formData.level === 'outro' && (
                      <input
                        type="text"
                        name="customLevel"
                        className="input-field"
                        placeholder="Digite o novo nível..."
                        value={formData.customLevel}
                        onChange={handleFieldChange}
                        style={{ marginTop: '8px' }}
                        required
                      />
                    )}
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

                  <div className="ai-preview-block content page-builder-shell">
                    <div className="ai-preview-block-header">
                      <span>Page builder do treinamento</span>
                      <div className="content-tools">
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
                    </div>

                    {contentMode === 'edit' ? (
                      <div className="page-builder-layout">
                        <div
                          className={`page-builder-canvas ${builderBlocks.length ? '' : 'is-empty'} ${dragState ? 'is-dragging' : ''}`}
                          onDragOver={(event) => event.preventDefault()}
                          onDrop={(event) => handleDropOnCanvas(event, builderBlocks.length)}
                        >
                          {builderBlocks.length === 0 && (
                            <button type="button" className="page-builder-empty" onClick={() => handleAddContentBlock('title')}>
                              <Plus size={18} />
                              <span>Adicionar o primeiro bloco</span>
                            </button>
                          )}

                          {builderBlocks.map((block, blockIndex) => (
                            <article
                              key={block.id}
                              className={`builder-block-card ${selectedBlockId === block.id ? 'is-selected' : ''}`}
                              draggable={selectedBlockId !== block.id}
                              onDragStart={(event) => {
                                const payload = { kind: 'existing-block', index: blockIndex };
                                setDragState(payload);
                                event.dataTransfer.setData('application/json', JSON.stringify(payload));
                              }}
                              onDragOver={(event) => event.preventDefault()}
                              onDrop={(event) => handleDropOnCanvas(event, blockIndex)}
                              onClick={() => setSelectedBlockId(block.id)}
                            >
                              <div className="builder-block-actions">
                                <GripVertical size={16} />
                                <strong>{blockMenu.find((item) => item.type === block.type)?.label ?? block.type}</strong>
                                <button type="button" title="Editar" onClick={() => setSelectedBlockId(block.id)}><Pencil size={14} /></button>
                                <button type="button" title="Duplicar" onClick={() => handleDuplicateContentBlock(block.id)}><Copy size={14} /></button>
                                <button type="button" title="Mover para cima" onClick={() => handleMoveContentBlock(blockIndex, blockIndex - 1)}>↑</button>
                                <button type="button" title="Mover para baixo" onClick={() => handleMoveContentBlock(blockIndex, blockIndex + 1)}>↓</button>
                                <button type="button" title="Remover" onClick={() => handleRemoveContentBlock(block.id)}><Trash2 size={14} /></button>
                              </div>
                              {selectedBlockId === block.id ? renderInlineBlockEditor(block) : renderBuilderPreview(block)}
                            </article>
                          ))}
                        </div>

                        <aside className="page-builder-sidebar">
                          <h4>Blocos</h4>
                          <div className="builder-block-menu">
                            {blockMenu.map(({ type, label, icon: Icon }) => (
                              <button
                                key={type}
                                type="button"
                                className="builder-menu-card"
                                draggable
                                onClick={() => handleAddContentBlock(type)}
                                onDragStart={(event) => {
                                  const payload = { kind: 'new-block', type };
                                  setDragState(payload);
                                  event.dataTransfer.setData('application/json', JSON.stringify(payload));
                                }}
                              >
                                <Icon size={16} />
                                <span>{label}</span>
                              </button>
                            ))}
                          </div>
                        </aside>
                      </div>
                    ) : (
                      <ContentBlockRenderer blocks={builderBlocks} fallbackContent={extractionPreview.content} />
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
                  {editingTrainingId || editingCatalogTraining ? 'Cancelar' : 'Limpar'}
                </button>
                <button type="submit" className="btn-primary" disabled={!extractionPreview || extractingPdf}>
                  {editingTrainingId || editingCatalogTraining ? <CheckCircle size={18} /> : <Plus size={18} />}
                  {editingTrainingId ? 'Salvar Alterações' : editingCatalogTraining ? 'Salvar Versão Editável' : 'Cadastrar Treinamento'}
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
                      {training.builtinSource && (
                        <span className="training-status catalog">Catálogo</span>
                      )}
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
                      {training.builtinSource ? 'Editar cópia' : 'Editar'}
                    </button>
                    {!training.builtinSource && (
                      <button type="button" className="btn-small btn-danger-ghost" onClick={() => handleDelete(training)}>
                        <Trash2 size={15} />
                        Remover
                      </button>
                    )}
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
