import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Award, ArrowLeft, BadgeCheck, Download, LogOut, Printer, ShieldCheck } from 'lucide-react';
import { getLatestCertificateByUser } from '../data/certificateStorage';
import { getMarketingCertificateStatus } from '../data/certificateEligibility';
import { issueMarketingCertificateIfEligible } from '../data/certificateActions';
import { getDepartmentLabel, getUserDepartmentId } from '../data/sectorAccess';
import './Certificate.css';

const formatDate = (date) => new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
}).format(new Date(date));

const DUMMY_CERTIFICATE = {
  id: 'PREVIEW-ONLY-DESIGN',
  userName: 'Nome do Colaborador',
  userEmail: 'colaborador@bbdi.com.br',
  moduleTitle: 'Marketing de Produtos',
  sectorTitle: 'Marketing de Produtos',
  trainingTrailName: 'Marketing de Produtos',
  quizTitle: 'Certificado de Marketing de Produtos',
  score: 10,
  totalQuestions: 10,
  percent: 100,
  issuedAt: new Date().toISOString(),
};

const Certificate = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';

  const [PDFDownloadLink, setPDFDownloadLink] = useState(null);
  const [MarketingCertificateDocument, setMarketingCertificateDocument] = useState(null);
  const [certificate, setCertificate] = useState(() => {
    if (isPreview) return DUMMY_CERTIFICATE;
    return getLatestCertificateByUser(currentUser.id);
  });
  const displayName = currentUser?.name ?? certificate?.userName ?? DUMMY_CERTIFICATE.userName;
  const displayTrailName = getDepartmentLabel(getUserDepartmentId(currentUser))
    || certificate?.trainingTrailName
    || certificate?.sectorTitle
    || DUMMY_CERTIFICATE.trainingTrailName;
  const resolvedCertificate = useMemo(() => {
    if (!certificate) {
      return certificate;
    }

    return {
      ...certificate,
      userName: displayName,
      trainingTrailName: displayTrailName,
    };
  }, [certificate, displayName, displayTrailName]);

  const certificateStatus = useMemo(
    () => (isPreview ? { isEligible: true } : getMarketingCertificateStatus(currentUser.id)),
    [currentUser.id, isPreview],
  );

  useEffect(() => {
    let mounted = true;

    Promise.all([
      import('@react-pdf/renderer'),
      import('../components/certificates/MarketingCertificateDocument'),
    ]).then(([rendererModule, documentModule]) => {
      if (!mounted) {
        return;
      }

      setPDFDownloadLink(() => rendererModule.PDFDownloadLink);
      setMarketingCertificateDocument(() => documentModule.default);
    });

    if (!isPreview) {
      Promise.resolve().then(() => {
        if (!mounted) {
          return;
        }

        const issuedCertificate = issueMarketingCertificateIfEligible(currentUser);

        if (issuedCertificate) {
          setCertificate(issuedCertificate);
        }
      });
    }

    return () => {
      mounted = false;
    };
  }, [currentUser, isPreview]);

  if (!certificateStatus.isEligible) {
    return (
      <div className="certificate-wrapper">
        <header className="certificate-header glass-panel">
          <div className="container certificate-header-content">
            <button className="btn-back" onClick={() => navigate('/dashboard')}>
              <ArrowLeft size={20} />
              <span>Voltar</span>
            </button>
            <div className="certificate-title">
              <ShieldCheck size={26} color="var(--accent-color)" />
              <h2>Certificado</h2>
            </div>
            <button onClick={onLogout} className="btn-logout" title="Sair">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <main className="container certificate-empty">
          <div className="certificate-empty-card glass-panel">
            <BadgeCheck size={40} color="var(--accent-color)" />
            <h1>Certificado bloqueado</h1>
            <p>
              O certificado da trilha só é liberado depois que o colaborador concluir a Avaliação Final e a
              atividade de Compatibilidade do seu departamento.
            </p>
            <button className="btn-primary" onClick={() => navigate('/trainings')}>
              Ir para treinamentos
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="certificate-wrapper">
        <header className="certificate-header glass-panel">
          <div className="container certificate-header-content">
            <button className="btn-back" onClick={() => navigate('/dashboard')}>
              <ArrowLeft size={20} />
              <span>Voltar</span>
            </button>
            <div className="certificate-title">
              <ShieldCheck size={26} color="var(--accent-color)" />
              <h2>Certificado de Conclusão</h2>
            </div>
            <button onClick={onLogout} className="btn-logout" title="Sair">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <main className="container certificate-empty">
          <div className="certificate-empty-card glass-panel">
            <BadgeCheck size={40} color="var(--accent-color)" />
            <h1>Gerando certificado</h1>
            <p>Estamos preparando o certificado liberado após a conclusão dos dois módulos finais.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="certificate-wrapper">
      <header className="certificate-header glass-panel">
        <div className="container certificate-header-content">
          <button className="btn-back" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={20} />
            <span>Voltar</span>
          </button>
          <div className="certificate-title">
            <ShieldCheck size={26} color="var(--accent-color)" />
            <h2>Certificado de Conclusão</h2>
          </div>
          <button onClick={onLogout} className="btn-logout" title="Sair">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="container certificate-main animate-fade-in">
        <section className="certificate-paper glass-panel">
          <div className="certificate-topbar">
            <span className="certificate-seal">
              <Award size={18} />
              Portal Treinamentos BBDI
            </span>
            <span className="certificate-id">ID {resolvedCertificate.id.slice(0, 8).toUpperCase()}</span>
          </div>

          <div className="certificate-body">
            <p className="certificate-kicker">Certificamos que</p>
            <h1>{resolvedCertificate.userName}</h1>
            <p className="certificate-intro">
              concluiu a trilha de {resolvedCertificate.trainingTrailName}, após finalizar a Avaliação Final Produtos e a
              Compatibilidade, demonstrando domínio dos critérios de identificação, compatibilidade e atendimento
              técnico.
            </p>

            <div className="certificate-highlight">
              <div>
                <span>Módulo</span>
                <strong>{resolvedCertificate.moduleTitle}</strong>
              </div>
              <div>
                <span>Aproveitamento</span>
                <strong>{resolvedCertificate.percent}%</strong>
              </div>
              <div>
                <span>Resultado</span>
                <strong>{resolvedCertificate.score}/{resolvedCertificate.totalQuestions} acertos</strong>
              </div>
            </div>

            <div className="certificate-details">
              <div>
                <span>Quiz</span>
                <strong>{resolvedCertificate.quizTitle}</strong>
              </div>
              <div>
                <span>Emitido em</span>
                <strong>{formatDate(resolvedCertificate.issuedAt)}</strong>
              </div>
              <div>
                <span>E-mail</span>
                <strong>{resolvedCertificate.userEmail}</strong>
              </div>
            </div>
          </div>

            <div className="certificate-footer">
            <div className="signature-block">
              <div className="signature-line" />
              <strong>Coordenação de Treinamentos</strong>
              <span>Portal Treinamentos BBDI</span>
            </div>
            <div className="certificate-actions no-print">
              {PDFDownloadLink && MarketingCertificateDocument ? (
                <PDFDownloadLink
                  document={<MarketingCertificateDocument certificate={resolvedCertificate} />}
                  fileName={`certificado-${resolvedCertificate.userName.toLowerCase().replace(/\s+/g, '-')}.pdf`}
                  className="btn-outline"
                >
                  {({ loading }) => (
                    <>
                      <Download size={18} />
                      {loading ? 'Gerando PDF...' : 'Baixar PDF'}
                    </>
                  )}
                </PDFDownloadLink>
              ) : (
                <button className="btn-outline" type="button" disabled>
                  <Download size={18} />
                  Carregando PDF...
                </button>
              )}
              <button className="btn-outline" onClick={() => window.print()}>
                <Printer size={18} />
                Imprimir
              </button>
              <button className="btn-outline" onClick={() => navigate('/dashboard')}>
                <ArrowLeft size={18} />
                Dashboard
              </button>
              <button className="btn-primary" onClick={() => navigate('/trainings')}>
                <Download size={18} />
                Continuar estudando
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Certificate;
