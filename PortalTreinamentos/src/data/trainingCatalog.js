import { modulesData } from './modulesData';
import { sectorsData } from './sectorsData';
import { readBackendSlice } from '../api/backendSync';
import {
  Battery,
  Zap,
  Monitor,
  Keyboard,
  MemoryStick,
  HardDrive,
  ClipboardCheck,
  CheckCircle,
  // Estoque Icons
  Inbox,
  Eye,
  Layers,
  ClipboardList,
  // Comercial Icons
  Handshake,
  FileText,
  UserPlus,
  TrendingUp,
  // Pos Venda Icons
  ShieldCheck,
  RefreshCw,
  Activity,
  RotateCcw,
  // SAC Icons
  PhoneCall,
  Filter,
  Edit3,
  Send,
  // Financeiro Icons
  DollarSign,
  Sliders,
  CreditCard,
  Clock,
  // Comunicao Icons
  Users,
  Megaphone,
  Compass,
  Briefcase,
  BookOpen
} from 'lucide-react';

const modulePresentation = {
  1: { icon: Battery, title: 'Baterias', color: '#3b82f6' },
  2: { icon: Zap, title: 'Fontes', color: '#10b981' },
  3: { icon: Monitor, title: 'Telas', color: '#8b5cf6' },
  4: { icon: Keyboard, title: 'Teclados', color: '#f59e0b' },
  5: { icon: MemoryStick, title: 'Memórias', color: '#ef4444' },
  6: { icon: HardDrive, title: 'SSD', color: '#06b6d4' },
  7: { icon: ClipboardCheck, title: 'Avaliação Final Produtos', color: '#14b8a6' },
  8: { icon: CheckCircle, title: 'Compatibilidade', color: '#f97316' },
  
  // Estoque (#0f766e)
  9: { icon: Inbox, title: 'Recebimento', color: '#0f766e' },
  10: { icon: Eye, title: 'Conferência', color: '#0f766e' },
  11: { icon: Layers, title: 'Organização', color: '#0f766e' },
  12: { icon: ClipboardList, title: 'Inventário', color: '#0f766e' },
  
  // Comercial (#b45309)
  13: { icon: Handshake, title: 'Negociação', color: '#b45309' },
  14: { icon: FileText, title: 'Proposta', color: '#b45309' },
  15: { icon: UserPlus, title: 'Cadastro', color: '#b45309' },
  16: { icon: TrendingUp, title: 'Conversão', color: '#b45309' },
  
  // Pós Venda (#7c3aed)
  17: { icon: ShieldCheck, title: 'Garantias', color: '#7c3aed' },
  18: { icon: RefreshCw, title: 'Trocas', color: '#7c3aed' },
  19: { icon: Activity, title: 'Acompanhamento', color: '#7c3aed' },
  20: { icon: RotateCcw, title: 'Análise de Retorno', color: '#7c3aed' },
  
  // SAC (#dc2626)
  21: { icon: PhoneCall, title: 'Atendimento', color: '#dc2626' },
  22: { icon: Filter, title: 'Triagem', color: '#dc2626' },
  23: { icon: Edit3, title: 'Registro', color: '#dc2626' },
  24: { icon: Send, title: 'Encaminhamento', color: '#dc2626' },
  
  // Financeiro (#16a34a)
  25: { icon: DollarSign, title: 'Faturamento', color: '#16a34a' },
  26: { icon: Sliders, title: 'Controle', color: '#16a34a' },
  27: { icon: CreditCard, title: 'Despesas', color: '#16a34a' },
  28: { icon: Clock, title: 'Rotina Financeira', color: '#16a34a' },
  
  // Comunicação (#0891b2)
  29: { icon: Users, title: 'Comunicação Interna', color: '#0891b2' },
  30: { icon: Megaphone, title: 'Campanhas', color: '#0891b2' },
  31: { icon: Compass, title: 'Alinhamentos', color: '#0891b2' },
  32: { icon: Briefcase, title: 'Materiais Institucionais', color: '#0891b2' },
};

export const getSectorById = (sectorId) => sectorsData.find((sector) => sector.id === sectorId);

export const getModulesForSector = (sectorId) => {
  const sector = getSectorById(sectorId);

  if (!sector) {
    return [];
  }

  const baseModules = sector.moduleIds
    .map((moduleId) => {
      const moduleInfo = modulesData[moduleId];
      const presentation = modulePresentation[moduleId];

      if (!moduleInfo || !presentation) {
        return null;
      }

      return {
        ...moduleInfo,
        ...presentation,
        count: moduleInfo.levels?.length ?? 0,
        progress: 0,
      };
    })
    .filter(Boolean);

  const trainings = readBackendSlice('trainings', []);
  const sectorTrainings = trainings.filter(t => String(t.departmentId) === String(sectorId));
  
  const dynamicModulesMap = {};
  const hardcodedIds = sector.moduleIds.map(String);

  sectorTrainings.forEach((t) => {
    const tModIdStr = String(t.moduleId || '').trim();
    if (!tModIdStr) return;

    if (!hardcodedIds.includes(tModIdStr)) {
      const lower = tModIdStr.toLowerCase();
      if (!dynamicModulesMap[lower]) {
        dynamicModulesMap[lower] = {
          id: tModIdStr,
          title: tModIdStr,
          description: t.description || 'Treinamento personalizado.',
          icon: BookOpen,
          color: sector.color || '#3b82f6',
          count: 0,
          progress: 0,
          levels: [
            { id: 'basico', title: 'Básico' },
            { id: 'intermediario', title: 'Intermediário' },
            { id: 'avancado', title: 'Avançado' }
          ]
        };
      }
      dynamicModulesMap[lower].count += 1;
    }
  });

  return [...baseModules, ...Object.values(dynamicModulesMap)];
};

export const getSectorSummary = (sectorId) => {
  const sector = getSectorById(sectorId);

  if (!sector) {
    return null;
  }

  const modules = getModulesForSector(sectorId);
  const trainings = readBackendSlice('trainings', []);
  const sectorTrainings = trainings.filter(t => String(t.departmentId) === String(sectorId));

  const filteredModules = modules.filter(m => {
    const idNum = Number(m.id);
    if (!isNaN(idNum) && idNum >= 1 && idNum <= 8) return true;

    const originalMod = modulesData[m.id];
    if (originalMod && originalMod.levels && originalMod.levels.some(l => l.lesson)) return true;

    const hasCustomTraining = sectorTrainings.some((t) => {
      const tModLower = String(t.moduleId).trim().toLowerCase();
      const mIdLower = String(m.id).trim().toLowerCase();
      const mTitleLower = String(m.title).trim().toLowerCase();
      return tModLower === mIdLower || tModLower === mTitleLower;
    });

    if (hasCustomTraining) return true;

    if (!originalMod) return true;

    return false;
  });

  return {
    ...sector,
    modules: filteredModules,
    moduleCount: filteredModules.length,
  };
};

export const getSectorSummaries = () => sectorsData.map((sector) => {
  const summary = getSectorSummary(sector.id);
  return summary;
});

export const getSectorIdByModuleId = (moduleId) => {
  const sector = sectorsData.find((s) => s.moduleIds.map(String).includes(String(moduleId)));
  if (sector) return sector.id;

  const trainings = readBackendSlice('trainings', []);
  const customTraining = trainings.find((t) => String(t.moduleId).trim().toLowerCase() === String(moduleId).trim().toLowerCase());
  return customTraining?.departmentId;
};

export const getModuleById = (moduleId) => {
  const sectorId = getSectorIdByModuleId(moduleId);
  if (!sectorId) return null;

  const modules = getModulesForSector(sectorId);
  return modules.find((m) => String(m.id).trim().toLowerCase() === String(moduleId).trim().toLowerCase());
};
