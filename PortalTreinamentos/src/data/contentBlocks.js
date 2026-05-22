const BLOCK_TYPES = ['title', 'image', 'link', 'table', 'videoEmbed', 'richText'];

export const blockTypes = BLOCK_TYPES;

const text = (value, maxLength = 12000) => (
  typeof value === 'string' ? value.slice(0, maxLength) : ''
);

export const createBlockId = () => `block-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const sanitizeHtml = (value = '') => text(value)
  .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
  .replace(/\son\w+="[^"]*"/gi, '')
  .replace(/\son\w+='[^']*'/gi, '')
  .replace(/\shref=(["'])javascript:[\s\S]*?\1/gi, ' href="#"')
  .replace(/\ssrc=(["'])javascript:[\s\S]*?\1/gi, ' src="#"');

export const getSafeEmbedUrl = (value = '') => {
  const rawUrl = text(value, 800).trim();

  if (!rawUrl) return '';

  try {
    const url = new URL(rawUrl);
    const host = url.hostname.replace(/^www\./, '').toLowerCase();

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (url.pathname === '/watch' && url.searchParams.get('v')) {
        return `https://www.youtube.com/embed/${encodeURIComponent(url.searchParams.get('v'))}`;
      }
      if (url.pathname.startsWith('/embed/')) {
        return `https://www.youtube.com${url.pathname}`;
      }
    }

    if (host === 'youtu.be' && url.pathname.length > 1) {
      return `https://www.youtube.com/embed/${encodeURIComponent(url.pathname.slice(1))}`;
    }

    if (host === 'vimeo.com' && /^\/\d+/.test(url.pathname)) {
      return `https://player.vimeo.com/video/${url.pathname.match(/\d+/)[0]}`;
    }

    if (host === 'player.vimeo.com' && url.pathname.startsWith('/video/')) {
      return `https://player.vimeo.com${url.pathname}`;
    }
  } catch {
    return '';
  }

  return '';
};

const hasContent = (block) => {
  const props = block?.props ?? {};

  if (block?.type === 'title') return Boolean(text(props.text).trim());
  if (block?.type === 'image') return Boolean(text(props.imageUrl).trim());
  if (block?.type === 'link') return Boolean(text(props.label).trim() && text(props.url).trim());
  if (block?.type === 'videoEmbed') return Boolean(text(props.url).trim());
  if (block?.type === 'richText') return Boolean(text(props.content).trim());
  if (block?.type === 'table') {
    return (Array.isArray(props.columns) && props.columns.some((cell) => text(cell).trim()))
      || (Array.isArray(props.rows) && props.rows.flat().some((cell) => text(cell).trim()));
  }

  return false;
};

export const createContentBlock = (type = 'richText', props = {}) => {
  const id = props.id ?? createBlockId();

  if (type === 'title') {
    return { id, type, props: { text: props.text ?? 'Novo titulo', level: props.level ?? 2 } };
  }

  if (type === 'image') {
    return { id, type, props: { imageUrl: props.imageUrl ?? '', imageAlt: props.imageAlt ?? '' } };
  }

  if (type === 'link') {
    return { id, type, props: { label: props.label ?? 'Novo link', url: props.url ?? '' } };
  }

  if (type === 'table') {
    return {
      id,
      type,
      props: {
        columns: Array.isArray(props.columns) && props.columns.length ? props.columns : ['Coluna 1', 'Coluna 2'],
        rows: Array.isArray(props.rows) && props.rows.length ? props.rows : [['', '']],
      },
    };
  }

  if (type === 'videoEmbed') {
    return { id, type, props: { url: props.url ?? '', title: props.title ?? 'Video do treinamento' } };
  }

  return { id, type: 'richText', props: { content: props.content ?? '<p>Novo texto</p>' } };
};

export const normalizeContentBlocks = (blocks = [], fallbackContent = '') => {
  const source = Array.isArray(blocks) ? blocks : [];

  const normalizedBlocks = source.flatMap((block, index) => {
    if (BLOCK_TYPES.includes(block?.type)) {
      const props = block.props ?? {};
      const typedBlock = createContentBlock(block.type, { ...props, id: block.id ?? `block-${index + 1}` });

      if (typedBlock.type === 'richText') {
        typedBlock.props.content = sanitizeHtml(typedBlock.props.content);
      }

      return hasContent(typedBlock) ? [typedBlock] : [];
    }

    const legacyTitle = text(block?.title, 240).trim();
    const legacyText = text(block?.text).trim();
    const legacyImageUrl = text(block?.imageUrl, 1200).trim();
    const legacyImageAlt = text(block?.imageAlt, 240).trim();
    const legacyBlocks = [];

    if (legacyTitle) {
      legacyBlocks.push(createContentBlock('title', { id: `${block?.id ?? `block-${index + 1}`}-title`, text: legacyTitle, level: 2 }));
    }

    if (legacyText) {
      legacyBlocks.push(createContentBlock('richText', {
        id: `${block?.id ?? `block-${index + 1}`}-text`,
        content: legacyText.split(/\n{2,}/).map((part) => `<p>${part.replace(/\n/g, '<br />')}</p>`).join(''),
      }));
    }

    if (legacyImageUrl) {
      legacyBlocks.push(createContentBlock('image', {
        id: `${block?.id ?? `block-${index + 1}`}-image`,
        imageUrl: legacyImageUrl,
        imageAlt: legacyImageAlt || legacyTitle,
      }));
    }

    return legacyBlocks;
  });

  if (normalizedBlocks.length) return normalizedBlocks.slice(0, 60);

  const fallback = text(fallbackContent).trim();
  return fallback ? [createContentBlock('richText', { content: fallback })] : [];
};

export const contentBlocksToMarkdown = (blocks = [], fallbackContent = '') => {
  const markdown = normalizeContentBlocks(blocks)
    .map((block) => {
      const props = block.props ?? {};

      if (block.type === 'title') return `${'#'.repeat(Number(props.level) || 2)} ${text(props.text).trim()}`;
      if (block.type === 'image') return props.imageUrl ? `![${text(props.imageAlt, 240).trim()}](${props.imageUrl})` : '';
      if (block.type === 'link') return props.url ? `[${text(props.label, 240).trim() || props.url}](${props.url})` : '';
      if (block.type === 'videoEmbed') return props.url ? `[Video: ${text(props.title, 240).trim() || props.url}](${props.url})` : '';
      if (block.type === 'table') {
        const columns = Array.isArray(props.columns) ? props.columns : [];
        const rows = Array.isArray(props.rows) ? props.rows : [];
        if (!columns.length) return '';
        return [
          `| ${columns.map((cell) => text(cell, 160).trim() || ' ').join(' | ')} |`,
          `| ${columns.map(() => '---').join(' | ')} |`,
          ...rows.map((row) => `| ${columns.map((_, index) => text(row?.[index], 300).trim() || ' ').join(' | ')} |`),
        ].join('\n');
      }
      return text(props.content).replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n\n').replace(/<[^>]+>/g, '').trim();
    })
    .filter(Boolean)
    .join('\n\n');

  return markdown || text(fallbackContent).trim();
};
