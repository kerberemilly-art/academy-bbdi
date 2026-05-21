import { bateriasModule } from './modules/baterias.js';
import { fontesModule } from './modules/fontes.js';
import { telasModule } from './modules/telas.js';
import { tecladosModule } from './modules/teclados.js';
import { memoriasModule } from './modules/memorias.js';
import { ssdModule } from './modules/ssd.js';
import { avaliacaoFinalModule } from './modules/avaliacaoFinal.js';
import { compatibilidadeModule } from './modules/compatibilidade.js';

const extraModulesInfo = {
  9: { title: 'Recebimento', desc: 'Processamento, triagem e entrada de insumos e mercadorias.' },
  10: { title: 'Conferência', desc: 'Checagem quantitativa, qualitativa e conferência contra notas fiscais.' },
  11: { title: 'Organização', desc: 'Métodos de endereçamento, estocagem ideal e controle de posições.' },
  12: { title: 'Inventário', desc: 'Contagem rotativa, auditoria física e conciliação de saldos no sistema.' },
  13: { title: 'Negociação', desc: 'Técnicas de persuasão, quebra de objeções e fechamento comercial.' },
  14: { title: 'Proposta', desc: 'Montagem de orçamentos, cotações complexas e propostas técnicas.' },
  15: { title: 'Cadastro', desc: 'Inserção de novos clientes, fornecedores e conformidade cadastral.' },
  16: { title: 'Conversão', desc: 'Estratégias de funil de vendas e resgate de leads frios.' },
  17: { title: 'Garantias', desc: 'Avaliação técnica de defeitos e fluxos de acionamento de garantias.' },
  18: { title: 'Trocas', desc: 'Operação de devolução por arrependimento ou incompatibilidade de peças.' },
  19: { title: 'Acompanhamento', desc: 'Follow-up de satisfação e resolução de gargalos operacionais no pós-venda.' },
  20: { title: 'Análise de Retorno', desc: 'Indicadores de qualidade, taxa de devolução e feedback de fábrica.' },
  21: { title: 'Atendimento', desc: 'Habilidades de escuta ativa, cordialidade e protocolo de relacionamento.' },
  22: { title: 'Triagem', desc: 'Categorização de demandas e distribuição correta para equipes de suporte.' },
  23: { title: 'Registro', desc: 'Abertura de tickets, documentação de problemas e histórico de atendimento.' },
  24: { title: 'Encaminhamento de Casos', desc: 'Escalonamento interno e acompanhamento de chamados críticos.' },
  25: { title: 'Faturamento', desc: 'Emissão de notas fiscais, conferência de impostos e guias de remessa.' },
  26: { title: 'Controle', desc: 'Conciliação bancária, fluxo de caixa e gestão de contas a pagar/receber.' },
  27: { title: 'Despesas', desc: 'Reembolsos corporativos, rateios e relatórios de gastos operacionais.' },
  28: { title: 'Rotina Financeira', desc: 'Calendário de fechamento mensal, rotinas de tesouraria e arquivos remessa/retorno.' },
  29: { title: 'Comunicação Interna', desc: 'Uso de ferramentas integradas, canais oficiais e comunicados corporativos.' },
  30: { title: 'Campanhas', desc: 'Estratégias de endomarketing, engajamento de colaboradores e datas comemorativas.' },
  31: { title: 'Alinhamentos', desc: 'Rotinas de reuniões gerais, repasse de metas e cultura institucional.' },
  32: { title: 'Materiais Institucionais', desc: 'Apresentações corporativas, manual da marca e repositório de documentos.' }
};

const extraModules = {};
Object.entries(extraModulesInfo).forEach(([idStr, info]) => {
  const id = Number(idStr);
  extraModules[id] = {
    id,
    title: info.title,
    description: info.desc,
    levels: [
      {
        id: 'basico',
        title: 'Básico',
        description: `Conceitos introdutórios, termos fundamentais e rotinas iniciais de ${info.title}.`
      },
      {
        id: 'intermediario',
        title: 'Intermediário',
        description: `Processos avançados, tratamento de exceções e uso prático das ferramentas de ${info.title}.`
      },
      {
        id: 'avancado',
        title: 'Avançado',
        description: `Análise crítica, tomada de decisão estratégica e liderança operacional em ${info.title}.`
      }
    ]
  };
});

export const modulesData = {
  1: bateriasModule,
  2: fontesModule,
  3: telasModule,
  4: tecladosModule,
  5: memoriasModule,
  6: ssdModule,
  7: avaliacaoFinalModule,
  8: compatibilidadeModule,
  ...extraModules
};
