import {
  ArrowRight,
  Building2,
  ClipboardList,
  Layers3,
  LayoutGrid,
  ShieldCheck,
  Sparkles,
  Users2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { modulesData } from '../data/modulesData';
import './Preview.css';

const previewSections = [
  {
    title: 'Governança',
    description: 'Marketing de Produtos define padrão, revisão e publicação.',
    icon: ShieldCheck,
  },
  {
    title: 'Setores',
    description: 'Cada área publica suas trilhas em um espaço próprio.',
    icon: Building2,
  },
  {
    title: 'Trilhas',
    description: 'Os módulos são agrupados por função e profundidade.',
    icon: Layers3,
  },
  {
    title: 'Acompanhamento',
    description: 'Progresso, notas e revisões ficam centralizados.',
    icon: ClipboardList,
  },
];

const governanceSteps = [
  'Rascunho do setor',
  'Revisão técnica',
  'Ajuste de linguagem e padrão',
  'Aprovação final',
  'Publicação no portal',
];

const sectorCards = [
  { name: 'Marketing de Produtos', accent: '#ef4444', modules: ['Baterias', 'Fontes', 'Telas', 'Teclados', 'Memórias', 'SSD', 'Compatibilidade'] },
  { name: 'Comercial', accent: '#0ea5e9', modules: ['Argumentação', 'Negociação', 'Portfólio', 'Atualizações'] },
  { name: 'Suporte Técnico', accent: '#14b8a6', modules: ['Diagnóstico', 'Garantia', 'Troubleshooting'] },
  { name: 'Pós-venda', accent: '#f59e0b', modules: ['Trocas', 'RMA', 'Comunicação com cliente'] },
];

const Preview = () => {
  const navigate = useNavigate();
  const marketingModules = [
    modulesData[1]?.title,
    modulesData[2]?.title,
    modulesData[3]?.title,
    modulesData[4]?.title,
    modulesData[5]?.title,
    modulesData[6]?.title,
    modulesData[8]?.title,
  ].filter(Boolean);

  return (
    <div className="preview-page">
      <main className="preview-shell">
        <section className="preview-hero glass-panel">
          <div className="preview-hero-copy">
            <span className="preview-kicker">
              <Sparkles size={14} />
              Esboço corporativo
            </span>
            <h1>Portal de Treinamentos por setor, com governança central.</h1>
            <p>
              Esta versão é apenas um protótipo visual. O portal atual continua intacto, enquanto
              esta tela mostra como a estrutura corporativa pode ser organizada.
            </p>

            <div className="preview-actions">
              <button className="btn-primary" onClick={() => navigate('/dashboard')}>
                Abrir portal atual
                <ArrowRight size={18} />
              </button>
              <button className="btn-outline" onClick={() => navigate('/certificate?preview=true')}>
                <ShieldCheck size={18} />
                Ver design do certificado
              </button>
              <span className="preview-note">Rota pública de visualização: `/preview`</span>
            </div>
          </div>

          <div className="preview-hero-panel">
            <div className="hero-stat">
              <strong>1</strong>
              <span>portal</span>
            </div>
            <div className="hero-stat">
              <strong>7</strong>
              <span>módulos de marketing</span>
            </div>
            <div className="hero-stat">
              <strong>4</strong>
              <span>setores de exemplo</span>
            </div>
          </div>
        </section>

        <section className="preview-grid">
          {previewSections.map((section) => {
            const Icon = section.icon;
            return (
              <article key={section.title} className="preview-card glass-panel">
                <div className="preview-card-icon">
                  <Icon size={22} />
                </div>
                <h2>{section.title}</h2>
                <p>{section.description}</p>
              </article>
            );
          })}
        </section>

        <section className="preview-workflow glass-panel">
          <div className="section-heading">
            <span className="preview-kicker">Fluxo de publicação</span>
            <h2>Como o conteúdo entra no portal</h2>
          </div>
          <div className="workflow-steps">
            {governanceSteps.map((step, index) => (
              <div key={step} className="workflow-step">
                <span>{index + 1}</span>
                <strong>{step}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="preview-layout">
          <article className="preview-sector glass-panel">
            <div className="section-heading">
              <span className="preview-kicker">Setor principal</span>
              <h2>Marketing de Produtos</h2>
            </div>
            <p className="preview-body">
              Este setor fica responsável pelos produtos, pela padronização do conteúdo e pela
              revisão final da base técnica.
            </p>
            <div className="module-tags">
              {marketingModules.map((module) => (
                <span key={module}>{module}</span>
              ))}
            </div>
          </article>

          <article className="preview-map glass-panel">
            <div className="section-heading">
              <span className="preview-kicker">Mapa do portal</span>
              <h2>Estrutura sugerida</h2>
            </div>
            <div className="portal-map">
              <div>
                <strong>Portal Corporativo</strong>
                <span>Entrada única</span>
              </div>
              <div>
                <strong>Setores</strong>
                <span>Áreas da empresa</span>
              </div>
              <div>
                <strong>Trilhas</strong>
                <span>Conteúdo por função</span>
              </div>
              <div>
                <strong>Módulos</strong>
                <span>Temas específicos</span>
              </div>
              <div>
                <strong>Aulas e avaliações</strong>
                <span>Validação do aprendizado</span>
              </div>
            </div>
          </article>
        </section>

        <section className="preview-sectors glass-panel">
          <div className="section-heading">
            <span className="preview-kicker">Expansão</span>
            <h2>Setores que podem entrar no mesmo padrão</h2>
          </div>
          <div className="sector-grid">
            {sectorCards.map((sector) => (
              <div key={sector.name} className="sector-card">
                <span className="sector-dot" style={{ backgroundColor: sector.accent }} />
                <strong>{sector.name}</strong>
                <p>{sector.modules.join(' · ')}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="preview-footer glass-panel">
          <Users2 size={20} />
          <div>
            <strong>Próximo passo</strong>
            <p>Se você aprovar esse esboço, eu transformo a home atual nessa arquitetura por etapas.</p>
          </div>
          <LayoutGrid size={20} />
        </section>
      </main>
    </div>
  );
};

export default Preview;
