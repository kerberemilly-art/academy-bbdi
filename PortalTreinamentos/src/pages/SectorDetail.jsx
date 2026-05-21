import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, LogOut, PencilLine, ShieldCheck } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getSectorSummary } from '../data/trainingCatalog';
import { canAccessMarketingModule, getMarketingModuleProgress, getMarketingModuleStatus, getMarketingTrainingProgress } from '../data/trainingPath';
import {
  canAccessSector,
  canManageSector,
  getUserDepartmentSummary,
} from '../data/sectorAccess';
import { fetchTrainings, getCachedTrainings } from '../data/trainingAdminApi';
import './SectorDetail.css';

const SectorDetail = ({ currentUser, onLogout }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const initialSector = getSectorSummary(id);
  const displayName = currentUser?.name?.trim() || 'Usuário';

  const [customTrainings, setCustomTrainings] = useState(() => getCachedTrainings());

  useEffect(() => {
    let cancelled = false;

    fetchTrainings()
      .then((items) => {
        if (!cancelled) {
          setCustomTrainings(items);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const sector = initialSector ? { ...initialSector } : null;

  if (sector) {
    const hardcodedModuleIds = sector.moduleIds.map(String);
    const sectorTrainings = customTrainings.filter((t) => t.departmentId === sector.id);

    const dynamicModulesMap = {};
    sectorTrainings.forEach((t) => {
      const tModIdStr = String(t.moduleId).trim();
      if (!tModIdStr) return;

      const isHardcoded = hardcodedModuleIds.includes(tModIdStr);
      if (!isHardcoded) {
        const lower = tModIdStr.toLowerCase();
        if (!dynamicModulesMap[lower]) {
          dynamicModulesMap[lower] = {
            id: tModIdStr,
            title: tModIdStr,
            description: t.description || 'Treinamento personalizado.',
            icon: BookOpen,
            color: sector.color || '#3b82f6',
            count: 3,
            levels: [
              { id: 'basico', title: 'Básico' },
              { id: 'intermediario', title: 'Intermediário' },
              { id: 'avancado', title: 'Avançado' }
            ]
          };
        }
      }
    });

    const dynamicModulesList = Object.values(dynamicModulesMap);
    const combinedModules = [...sector.modules, ...dynamicModulesList];

    sector.modules = combinedModules.filter((m) => {
      const idNum = Number(m.id);
      if (!isNaN(idNum) && idNum >= 1 && idNum <= 8) {
        return true;
      }
      return sectorTrainings.some((t) => {
        const tModLower = String(t.moduleId).trim().toLowerCase();
        const mIdLower = String(m.id).trim().toLowerCase();
        const mTitleLower = String(m.title).trim().toLowerCase();
        return tModLower === mIdLower || tModLower === mTitleLower;
      });
    });
  }

  const canManageCurrentSector = sector ? canManageSector(currentUser, sector.id) : false;

  if (!sector) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Departamento não encontrado.</h2>
        <button className="btn-primary" onClick={() => navigate('/trainings')} style={{ marginTop: '20px' }}>
          Voltar para departamentos
        </button>
      </div>
    );
  }

  const hasModules = sector.modules.length > 0;
  const isLockedForUser = currentUser?.role !== 'master' && !canAccessSector(currentUser, sector.id);
  const isAnyAdmin = currentUser?.role === 'master' || currentUser?.role === 'admin';

  const trainingProgress = getMarketingTrainingProgress(currentUser?.id, sector.id);
  const progressPercent = trainingProgress.progressPercent;
  const remainingSteps = trainingProgress.remainingSteps;

  if (isLockedForUser) {
    return (
      <div className="sector-detail-wrapper animate-fade-in">
        <header className="sector-detail-header">
          <div className="container header-content">
            <div className="header-left">
              <button className="btn-back" onClick={() => navigate('/trainings')} title="Voltar para Departamentos">
                <ArrowLeft size={20} />
              </button>
              <div className="sector-header-info">
                <span className="section-kicker">Departamento</span>
                <h2>{sector.title}</h2>
              </div>
            </div>
            <div className="header-actions">
              <div className="user-profile">
                <div className="avatar">{displayName.charAt(0).toUpperCase()}</div>
                <span>{displayName}</span>
              </div>
              <button onClick={onLogout} className="btn-logout" title="Sair">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        <main className="container sector-detail-main">
          <section className="empty-sector">
            <ShieldCheck size={40} color="var(--accent-color)" style={{ marginBottom: '16px' }} />
            <h2>Acesso Restrito</h2>
            <p>
              Suas áreas liberadas são {getUserDepartmentSummary(currentUser)}. O departamento{' '}
              {sector.title} está bloqueado para o seu perfil. Entre em contato com a coordenação para solicitar acesso.
            </p>
            <button className="btn-primary" onClick={() => navigate('/dashboard')}>
              Voltar para o Dashboard
            </button>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="sector-detail-wrapper animate-fade-in">
      <header className="sector-detail-header">
        <div className="container header-content">
          <div className="header-left">
            <button className="btn-back" onClick={() => navigate('/trainings')} title="Voltar para Departamentos">
              <ArrowLeft size={20} />
            </button>
            <div className="sector-header-info">
              <span className="section-kicker">Departamento</span>
              <h2>{sector.title}</h2>
            </div>
          </div>
          <div className="header-actions">
            {canManageCurrentSector && (
              <button 
                className="btn-outline" 
                onClick={() => navigate('/admin/trainings')}
                style={{ height: '40px' }}
              >
                <PencilLine size={18} />
                <span>Gerenciar Treinamentos</span>
              </button>
            )}
            <div className="user-profile">
              <div className="avatar">{displayName.charAt(0).toUpperCase()}</div>
              <span>{displayName}</span>
            </div>
            <button onClick={onLogout} className="btn-logout" title="Sair">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="container sector-detail-main">
        <section className="sector-hero">
          <div className="sector-hero-content">
            <span className="section-kicker">Treinamento Corporativo</span>
            <h1>{sector.title}</h1>
            <p>{sector.description}</p>
          </div>
          <div className="sector-hero-stats">
            {isAnyAdmin ? (
              <>
                <div>
                  <strong>{sector.modules.length}</strong>
                  <span>Módulos</span>
                </div>
                <div>
                  <strong>Gerenciando</strong>
                  <span>Status Admin</span>
                </div>
              </>
            ) : (
              <>
                <div>
                  <strong>{progressPercent}%</strong>
                  <span>Progresso</span>
                </div>
                <div>
                  <strong>{remainingSteps}</strong>
                  <span>Restantes</span>
                </div>
              </>
            )}
          </div>
        </section>

        {hasModules ? (
          <section className="modules-section">
            <div className="panel-heading">
              <BookOpen size={20} color="var(--accent-color)" />
              <h2>Módulos de Capacitação Técnica</h2>
            </div>
            <div className="modules-grid">
              {sector.modules.map((module) => (
                <ProductCard
                  key={module.id}
                  module={{
                    ...module,
                    progress: isAnyAdmin ? 0 : getMarketingModuleProgress(currentUser?.id, module.id),
                    hideProgress: isAnyAdmin,
                  }}
                  backTo={`/sector/${sector.id}`}
                  locked={isAnyAdmin ? false : (!currentUser || !canAccessMarketingModule(currentUser, module.id))}
                  completed={isAnyAdmin ? false : getMarketingModuleStatus(currentUser, module.id).isCompleted}
                />
              ))}
            </div>
          </section>
        ) : (
          <section className="empty-sector">
            <BookOpen size={40} color="var(--accent-color)" style={{ marginBottom: '16px' }} />
            <h2>Conteúdo em Preparação</h2>
            <p>
              A grade curricular técnica para este departamento já está definida. 
              Os materiais estão sendo revisados para publicação.
            </p>
            {canManageCurrentSector ? (
              <button className="btn-highlight" onClick={() => navigate('/admin/trainings')}>
                Publicar Treinamento
              </button>
            ) : (
              <button className="btn-primary" onClick={() => navigate('/trainings')}>
                Voltar para Departamentos
              </button>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default SectorDetail;
