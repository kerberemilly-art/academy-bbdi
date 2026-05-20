import { modulesData } from './modulesData';
import { sectorsData } from './sectorsData';
import {
  Battery,
  Zap,
  Monitor,
  Keyboard,
  MemoryStick,
  HardDrive,
  ClipboardCheck,
  CheckCircle,
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
};

export const getSectorById = (sectorId) => sectorsData.find((sector) => sector.id === sectorId);

export const getModulesForSector = (sectorId) => {
  const sector = getSectorById(sectorId);

  if (!sector) {
    return [];
  }

  return sector.moduleIds
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
};

export const getSectorSummary = (sectorId) => {
  const sector = getSectorById(sectorId);

  if (!sector) {
    return null;
  }

  const modules = getModulesForSector(sectorId);

  return {
    ...sector,
    modules,
    moduleCount: modules.length,
  };
};

export const getSectorSummaries = () => sectorsData.map((sector) => ({
  ...sector,
  modules: getModulesForSector(sector.id),
  moduleCount: getModulesForSector(sector.id).length,
}));
