import { sectorsData } from './sectorsData';
import { getModulesForSector } from './trainingCatalog';
import { modulesData } from './modulesData';
import { blockTypes, createContentBlock, normalizeContentBlocks } from './contentBlocks';

export const markdownToContentBlocks = (content = '') => {
  const normalized = String(content ?? '').replace(/\\n/g, '\n').trim();

  if (!normalized) {
    return [];
  }

  const sections = normalized
    .split(/\n(?=#{1,3}\s+)/g)
    .map((section) => section.trim())
    .filter(Boolean);
  const source = sections.length ? sections : [normalized];

  return source.flatMap((section, index) => {
    const lines = section.split('\n');
    const heading = lines[0]?.match(/^#{1,3}\s+(.+)$/)?.[1]?.trim();
    const bodyLines = heading ? lines.slice(1) : lines;
    const imageMatch = bodyLines.join('\n').match(/!\[([^\]]*)\]\(([^)]+)\)/);
    const text = bodyLines
      .join('\n')
      .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
      .trim();

    return normalizeContentBlocks([{
      id: `legacy-${index + 1}`,
      title: heading || `Bloco ${index + 1}`,
      text,
      imageUrl: imageMatch?.[2] ?? '',
      imageAlt: imageMatch?.[1] ?? heading ?? '',
    }]);
  });
};

const getLessonSections = (lesson = {}) => (
  Array.isArray(lesson.steps) ? lesson.steps : Array.isArray(lesson.pages) ? lesson.pages : []
);

const getLessonImages = (section = {}) => [
  ...(Array.isArray(section.image) ? section.image : section.image ? [section.image] : []),
  ...(Array.isArray(section.images) ? section.images : []),
];

const markdownFromLesson = (lesson = {}) => (
  getLessonSections(lesson)
    .map((section) => [
      section?.title ? `## ${section.title}` : '',
      section?.content ?? '',
      ...getLessonImages(section).map((imageUrl, index) => `![${section?.title ?? `Imagem ${index + 1}`}](${imageUrl})`),
    ].filter(Boolean).join('\n\n'))
    .filter(Boolean)
    .join('\n\n')
);

const quizQuestionsFromLesson = (lessonQuiz = {}) => (
  Array.isArray(lessonQuiz.questions)
    ? lessonQuiz.questions.map((question, index) => ({
        id: String(question.id ?? `q-${index + 1}`),
        question: question.question ?? '',
        options: question.options ?? [],
        answerIndex: Number.isInteger(question.correctAnswer) ? question.correctAnswer : question.answerIndex ?? 0,
        explanation: question.explanation ?? '',
      }))
    : []
);

export const getBuiltinTrainings = (departments = sectorsData) => (
  departments.flatMap((department) => (
    getModulesForSector(department.id).flatMap((module) => {
      const moduleInfo = modulesData[module.id];
      return (moduleInfo?.levels ?? [])
        .filter((level) => level.lesson)
        .map((level) => {
          const content = markdownFromLesson(level.lesson);
          return {
            id: `builtin-${department.id}-${module.id}-${level.id}`,
            builtinSource: true,
            departmentId: department.id,
            moduleId: String(module.id),
            level: level.id,
            status: 'published',
            title: `${module.title} - ${level.title}`,
            description: level.description ?? module.description ?? '',
            content,
            contentBlocks: markdownToContentBlocks(content),
            quizQuestions: quizQuestionsFromLesson(level.lesson.quiz),
          };
        });
    })
  ))
);

export const getEditableContentBlocks = (preview) => {
  if (!preview) return [];

  if (Array.isArray(preview.contentBlocks) && preview.contentBlocks.length) {
    return preview.contentBlocks.flatMap((block, index) => {
      if (blockTypes.includes(block?.type)) {
        return [createContentBlock(block.type, { ...(block.props ?? {}), id: block.id ?? `block-${index + 1}` })];
      }

      return normalizeContentBlocks([block]);
    });
  }

  return markdownToContentBlocks(preview.content);
};
