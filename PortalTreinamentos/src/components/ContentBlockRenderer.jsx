import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getSafeEmbedUrl, normalizeContentBlocks, sanitizeHtml } from '../data/contentBlocks';

const renderTitle = (block) => {
  const props = block.props ?? {};
  const level = Math.min(Math.max(Number(props.level) || 2, 1), 3);
  const Tag = `h${level}`;

  return <Tag>{props.text}</Tag>;
};

const ContentBlockRenderer = ({ blocks = [], fallbackContent = '', className = 'training-content-blocks' }) => {
  const normalizedBlocks = normalizeContentBlocks(blocks, fallbackContent);

  if (!normalizedBlocks.length) {
    return (
      <div className="training-markdown">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {fallbackContent ? fallbackContent.replace(/\\n/g, '\n') : 'Conteudo ainda nao informado.'}
        </ReactMarkdown>
      </div>
    );
  }

  return (
    <div className={className}>
      {normalizedBlocks.map((block, index) => {
        const props = block.props ?? {};
        const embedUrl = block.type === 'videoEmbed' ? getSafeEmbedUrl(props.url) : '';

        return (
          <article key={block.id ?? index} className={`training-content-block block-type-${block.type}`}>
            {block.type === 'title' && (
              <div className="training-content-block-copy">
                {renderTitle(block)}
              </div>
            )}

            {block.type === 'richText' && (
              <div
                className="training-content-block-copy rich-text-content"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(props.content) }}
              />
            )}

            {block.type === 'image' && props.imageUrl && (
              <div className="training-content-block-image">
                <img src={props.imageUrl} alt={props.imageAlt || `Bloco ${index + 1}`} />
              </div>
            )}

            {block.type === 'link' && props.url && (
              <div className="training-content-block-copy">
                <a className="training-content-link" href={props.url} target="_blank" rel="noreferrer">
                  {props.label || props.url}
                </a>
              </div>
            )}

            {block.type === 'table' && (
              <div className="training-content-table-wrap">
                <table className="training-content-table">
                  <thead>
                    <tr>
                      {(props.columns ?? []).map((column, columnIndex) => (
                        <th key={`${block.id}-head-${columnIndex}`}>{column}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(props.rows ?? []).map((row, rowIndex) => (
                      <tr key={`${block.id}-row-${rowIndex}`}>
                        {(props.columns ?? []).map((_, columnIndex) => (
                          <td key={`${block.id}-cell-${rowIndex}-${columnIndex}`}>{row?.[columnIndex] ?? ''}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {block.type === 'videoEmbed' && (
              <div className="training-content-video">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={props.title || `Video ${index + 1}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <span>URL de video invalida.</span>
                )}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
};

export default ContentBlockRenderer;
