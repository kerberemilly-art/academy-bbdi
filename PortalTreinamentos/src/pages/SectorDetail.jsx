import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, LogOut } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getSectorSummary } from '../data/trainingCatalog';
import { canAccessMarketingModule, getMarketingModuleProgress, getMarketingModuleStatus, getMarketingTrainingProgress } from '../data/trainingPath';
import {
  canAccessSector,
  getUserDepartmentSummary,
} from '../data/sectorAccess';
import './SectorDetail.css';

const SectorDetail = ({ currentUser, onLogout }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const sector = getSectorSummary(id);
  const displayName = currentUser?.name?.trim() || 'Usuário';
  const trainingProgress = getMarketingTrainingProgress(currentUser?.id);

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
            {sector.id === 'marketing-produtos' ? (
              <>
                <div>
                  <strong>{trainingProgress.progressPercent}%</strong>
                  <span>progresso</span>
                </div>
                <div>
                  <strong>{trainingProgress.remainingSteps}</strong>
                  <span>etapas para terminar</span>
                </div>
              </>
            ) : (
              <>
                <div>
                  <strong>{sector.moduleCount}</strong>
                  <span>{sector.moduleCount === 1 ? 'treinamento' : 'treinamentos'}</span>
                </div>
                <div>
                  <strong>{sector.status === 'active' ? 'Ativo' : 'Em preparação'}</strong>
                  <span>status</span>
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
                  progress: getMarketingModuleProgress(currentUser?.id, module.id),
                }}
                backTo={`/sector/${sector.id}`}
                locked={!currentUser || !canAccessMarketingModule(currentUser, module.id)}
                completed={getMarketingModuleStatus(currentUser, module.id).isCompleted}
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
            <button className="btn-primary" onClick={() => navigate('/trainings')}>
              Voltar para setores
            </button>
          </section>
        )}
      </main>
    </div>
  );
};

export default SectorDetail;
