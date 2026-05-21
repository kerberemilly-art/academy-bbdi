import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, LogOut, PencilLine } from 'lucide-react';
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

    // Filter to only display modules that have at least one registered training in the DB
    // OR are the built-in pre-packaged trainings with real content (IDs 1 to 8)
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
        <h2>Setor não encontrado.</h2>
        <button className="btn-primary" onClick={() => navigate('/trainings')} style={{ marginTop: '20px' }}>
          Voltar para setores
        </button>
      </div>
    );
  }

  const Icon = sector.icon;
  const hasModules = sector.modules.length > 0;
  const isLockedForUser = currentUser?.role !== 'master' && !canAccessSector(currentUser, sector.id);
  const isAnyAdmin = currentUser?.role === 'master' || currentUser?.role === 'admin';

  // Dynamic progress calculations across all departments using generalized trainingPath.js
  const trainingProgress = getMarketingTrainingProgress(currentUser?.id, sector.id);
  const progressPercent = trainingProgress.progressPercent;
  const remainingSteps = trainingProgress.remainingSteps;

  if (isLockedForUser) {
    return (
      <div className="sector-detail-wrapper animate-fade-in">
        <header className="sector-detail-header glass-panel" style={{ borderBottomColor: sector.color }}>
          <div className="container header-content">
            <div className="header-logo">
              <button className="btn-back compact" onClick={() => navigate('/trainings')}>
                <ArrowLeft size={20} />
                <span>Voltar</span>
              </button>
              <div className="header-title">
                <Icon size={28} color={sector.color} />
                <div>
                  <span className="section-kicker">Setor</span>
                  <h2>{sector.title}</h2>
                </div>
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
          <section className="empty-sector glass-panel">
            <BookOpen size={28} color={sector.color} />
            <h2>Departamento bloqueado</h2>
            <p>
              Suas áreas liberadas são {getUserDepartmentSummary(currentUser)}. O departamento{' '}
              {sector.title} aparece bloqueado até o master liberar o acesso.
            </p>
            <button className="btn-primary" onClick={() => navigate('/dashboard')}>
              Voltar para a home
            </button>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="sector-detail-wrapper animate-fade-in">
      <header className="sector-detail-header glass-panel" style={{ borderBottomColor: sector.color }}>
        <div className="container header-content">
          <div className="header-logo">
            <button className="btn-back compact" onClick={() => navigate('/trainings')}>
              <ArrowLeft size={20} />
              <span>Voltar</span>
            </button>
            <div className="header-title">
              <Icon size={28} color={sector.color} />
              <div>
                <span className="section-kicker">Setor</span>
                <h2>{sector.title}</h2>
              </div>
            </div>
          </div>
          <div className="header-actions">
            {canManageCurrentSector && (
              <button 
                className="btn-users" 
                onClick={() => navigate('/admin/trainings')}
                style={{ marginRight: '12px', display: 'flex', alignItems: 'center', gap: '6px', height: '38px', padding: '0 16px' }}
              >
                <PencilLine size={16} />
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
        <section className="sector-hero glass-panel">
          <div>
            <span className="section-kicker">Setor selecionado</span>
            <h1>{sector.title}</h1>
            <p>{sector.description}</p>
          </div>
          <div className="sector-hero-stats">
            {isAnyAdmin ? (
              <>
                <div>
                  <strong>{sector.modules.length}</strong>
                  <span>{sector.modules.length === 1 ? 'Módulo' : 'Módulos'}</span>
                </div>
                <div>
                  <strong style={{ color: 'var(--accent-color)' }}>Gerenciando</strong>
                  <span>Função Administrativa</span>
                </div>
              </>
            ) : (
              <>
                <div>
                  <strong>{progressPercent}%</strong>
                  <span>progresso</span>
                </div>
                <div>
                  <strong>{remainingSteps}</strong>
                  <span>{remainingSteps === 1 ? 'etapa para terminar' : 'etapas para terminar'}</span>
                </div>
              </>
            )}
          </div>
        </section>

        {hasModules ? (
          <section className="modules-grid">
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
          </section>
        ) : (
          <section className="empty-sector glass-panel">
            <BookOpen size={28} color={sector.color} />
            <h2>Treinamentos ainda não cadastrados neste setor</h2>
            <p>
              A estrutura já está pronta. Quando os materiais deste setor forem incluídos, eles vão aparecer
              automaticamente nesta tela.
            </p>
            {canManageCurrentSector ? (
              <button className="btn-primary" onClick={() => navigate('/admin/trainings')}>
                Cadastrar treinamento
              </button>
            ) : (
              <button className="btn-primary" onClick={() => navigate('/trainings')}>
                Voltar para setores
              </button>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default SectorDetail;
