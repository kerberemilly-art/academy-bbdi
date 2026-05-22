import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Award, ArrowLeft, BadgeCheck, Download, LogOut, Printer, ShieldCheck } from 'lucide-react';
import { getLatestCertificateByUser, getCertificateById } from '../api/certificateStorage';
import { getDepartmentLabel, getUserDepartmentId } from '../data/sectorAccess';
import { capitalizeName } from '../data/certificateTemplates';
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
  moduleTitle: 'Baterias',
  sectorTitle: 'Pós Vendas',
  levelTitle: 'Básico',
  trainingTrailName: 'Pós Vendas',
  quizTitle: 'Certificado de Baterias',
  score: 10,
  totalQuestions: 10,
  percent: 100,
  issuedAt: new Date().toISOString(),
};

const Certificate = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';
  const certId = searchParams.get('id');

  const cardRef = useRef(null);
  const shineRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const shine = shineRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((centerY - y) / centerY) * 8; // Max 8 degrees tilt
    const rotateY = ((x - centerX) / centerX) * 8;

    const shineX = (x / rect.width) * 100;
    const shineY = (y / rect.height) * 100;

    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    
    if (shine) {
      shine.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0) 55%)`;
      shine.style.opacity = '1';
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    const shine = shineRef.current;
    if (!card) return;

    card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    if (shine) {
      shine.style.opacity = '0';
    }
  };

  const [PDFDownloadLink, setPDFDownloadLink] = useState(null);
  const [BlobProvider, setBlobProvider] = useState(null);
  const [GenericCertificateDocument, setGenericCertificateDocument] = useState(null);
  const [certificate, setCertificate] = useState(() => {
    if (isPreview) return DUMMY_CERTIFICATE;
    if (certId) {
      const specificCert = getCertificateById(certId);
      if (specificCert && specificCert.userId === currentUser.id) return specificCert;
    }
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
    () => (isPreview ? { isEligible: true } : { isEligible: !!certificate }),
    [certificate, isPreview]
  );

  useEffect(() => {
    let mounted = true;

    Promise.all([
      import('@react-pdf/renderer'),
      import('../components/certificates/GenericCertificateDocument'),
    ]).then(([rendererModule, documentModule]) => {
      if (!mounted) {
        return;
      }

      setPDFDownloadLink(() => rendererModule.PDFDownloadLink);
      setBlobProvider(() => rendererModule.BlobProvider);
      setGenericCertificateDocument(() => documentModule.default);
    });

    if (!isPreview && !certId) {
      Promise.resolve().then(() => {
        if (!mounted) {
          return;
        }

        const issuedCertificate = getLatestCertificateByUser(currentUser.id);

        if (issuedCertificate) {
          setCertificate(issuedCertificate);
        }
      });
    }

    return () => {
      mounted = false;
    };
  }, [currentUser, isPreview, certId]);

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
              O certificado é liberado assim que você conclui e é aprovado na avaliação de um treinamento. Continue estudando!
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
        <section 
          ref={cardRef}
          className="certificate-paper glass-panel"
        >
          <div className="certificate-topbar">
            <span className="certificate-seal">
              <Award size={18} />
              Portal Treinamentos BBDI
            </span>
            <span className="certificate-id">ID {resolvedCertificate.id.slice(0, 8).toUpperCase()}</span>
          </div>

          <div className="certificate-body">
            <p className="certificate-kicker">Certificamos que</p>
            <h1>{capitalizeName(resolvedCertificate.userName)}</h1>
            <p className="certificate-intro" style={{ fontStyle: 'italic', maxWidth: '650px', margin: '0 auto 30px' }}>
              Concluiu com êxito a seguinte etapa de treinamento, demonstrando dedicação e compromisso com seu desenvolvimento profissional.
            </p>

            <div className="certificate-highlight">
              <div>
                <span>Módulo</span>
                <strong>{resolvedCertificate.moduleTitle}</strong>
              </div>
              <div>
                <span>Departamento</span>
                <strong>{resolvedCertificate.sectorTitle}</strong>
              </div>
              <div>
                <span>Nível</span>
                <strong>{resolvedCertificate.levelTitle}</strong>
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
            </div>
          </div>

            <div className="certificate-footer">
            <div className="signature-block">
              <div className="signature-line" />
              <strong>Coordenação de Treinamentos</strong>
              <span>Portal Treinamentos BBDI</span>
            </div>
            <div className="certificate-actions no-print">
              {BlobProvider && GenericCertificateDocument ? (
                <BlobProvider document={<GenericCertificateDocument certificate={resolvedCertificate} />}>
                  {({ url, loading, error }) => {
                    const fileName = `certificado-${(resolvedCertificate?.userName || 'usuario').toLowerCase().replace(/\s+/g, '-')}.pdf`;
                    return (
                      <>
                        <a
                          href={url || '#'}
                          download={fileName}
                          className="btn-outline"
                          style={{ pointerEvents: loading || error ? 'none' : 'auto', opacity: loading || error ? 0.6 : 1 }}
                        >
                          <Download size={18} />
                          {loading ? 'Gerando...' : 'Baixar PDF'}
                        </a>
                        <button 
                          className="btn-primary" 
                          onClick={() => {
                            if (url) {
                              const newWindow = window.open(url, '_blank');
                              if (newWindow) {
                                newWindow.onload = () => {
                                  newWindow.print();
                                };
                              }
                            }
                          }}
                          disabled={loading || error}
                        >
                          <Printer size={18} />
                          Imprimir PDF
                        </button>
                      </>
                    );
                  }}
                </BlobProvider>
              ) : (
                <>
                  <button className="btn-outline" type="button" disabled>
                    <Download size={18} />
                    Carregando...
                  </button>
                  <button className="btn-primary" type="button" disabled>
                    <Printer size={18} />
                    Carregando...
                  </button>
                </>
              )}
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
