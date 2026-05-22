import { Download, Printer, ShieldCheck, Layout } from 'lucide-react';
import { useEffect, useState } from 'react';
import './CertificateShowcase.css';
import { certificateTemplates, fillTemplate } from '../data/certificateTemplates';
import { getCurrentUser } from '../api/usersStorage';
import { getDepartmentLabel, getUserDepartmentId } from '../data/sectorAccess';

const certificate = {
  userName: 'Nome do Colaborador',
  trainingTrailName: 'Marketing de Produtos',
  score: 10,
  totalQuestions: 10,
  percent: 100,
  issuedAt: new Date('2026-05-20T15:30:00').toISOString(),
};

const formatDate = (date) => new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
}).format(new Date(date));

const CertificateShowcase = () => {
  const [activeTemplateKey, setActiveTemplateKey] = useState('marketingProducts');
  const template = certificateTemplates[activeTemplateKey];
  
  const currentUser = getCurrentUser();
  const displayName = currentUser?.name ?? certificate.userName;
  const displayTrailName = activeTemplateKey === 'marketingProducts' 
    ? (getDepartmentLabel(getUserDepartmentId(currentUser)) || certificate.trainingTrailName)
    : template.programTitle;

  const statement = fillTemplate(template.statement, {
    nome: displayName,
    programa: displayTrailName,
  });

  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    const root = document.documentElement;
    const previousTheme = root.dataset.theme;
    root.dataset.theme = 'light';

    return () => {
      if (previousTheme) {
        root.dataset.theme = previousTheme;
      } else {
        delete root.dataset.theme;
      }
    };
  }, []);

  return (
    <main className="certificate-showcase">
      <section className="showcase-toolbar">
        <div className="showcase-left">
          <span className="showcase-kicker">
            <ShieldCheck size={14} />
            Visualização pública
          </span>
          <div className="template-switcher">
            <Layout size={16} />
            <button 
              className={activeTemplateKey === 'marketingProducts' ? 'active' : ''} 
              onClick={() => setActiveTemplateKey('marketingProducts')}
            >
              Marketing
            </button>
            <button 
              className={activeTemplateKey === 'generic' ? 'active' : ''} 
              onClick={() => setActiveTemplateKey('generic')}
            >
              Genérico
            </button>
          </div>
        </div>
        <div className="showcase-actions">
          <button type="button" className="btn-outline" onClick={() => window.print()}>
            <Printer size={18} />
            Impressão
          </button>
          <a
            className="btn-primary"
            href="/certificate?preview=true"
            target="_blank"
            rel="noreferrer"
          >
            <Download size={18} />
            Abrir versão antiga
          </a>
        </div>
      </section>

      <section className="certificate-card">
        <div className="certificate-accent" />
        <div className="certificate-topbar">
          <div className="certificate-logo" aria-label={template.institution}>
            <span className="certificate-logo-line">Grupo</span>
            <span className="certificate-logo-brand">BBDI</span>
          </div>
          <span className="certificate-code">ID PREVIEW-2026</span>
        </div>

        <div className="certificate-content">
          <p className="certificate-label">{template.headline || 'Certificado de Conclusão'}</p>
          <h2>{displayName}</h2>
          <p className="certificate-statement">{statement}</p>

          <div className="certificate-grid">
            <article>
              <span>{activeTemplateKey === 'marketingProducts' ? 'Trilha' : 'Programa'}</span>
              <strong>{displayTrailName}</strong>
            </article>
            <article>
              <span>Aproveitamento</span>
              <strong>{certificate.percent}%</strong>
            </article>
            <article>
              <span>Resultado</span>
              <strong>
                {certificate.score}/{certificate.totalQuestions}
              </strong>
            </article>
          </div>

          <p className="certificate-issued">Emitido em {formatDate(certificate.issuedAt)}</p>
        </div>

        <footer className="certificate-footer">
          <div className="signature">
            <div className="signature-line" />
            <strong>{activeTemplateKey === 'marketingProducts' ? 'Coordenação de Treinamentos' : 'Diretoria Executiva'}</strong>
            <span>{template.institution}</span>
          </div>
          <div className="footer-note">{template.footerNote || 'Documento emitido automaticamente pelo portal.'}</div>
        </footer>
      </section>
    </main>
  );
};

export default CertificateShowcase;
