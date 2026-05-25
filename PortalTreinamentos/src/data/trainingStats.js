import { useMemo } from 'react';
import { getBuiltinTrainings } from './adminTrainingCatalog';
import { canAccessSector } from './sectorAccess';

/**
 * Calculates a summary of departments with their respective training counts.
 * Merges builtin trainings (from modulesData) and custom trainings (from backend).
 * 
 * @param {Object} currentUser The current logged in user
 * @param {Array} sectors List of sectors (summaries)
 * @param {Array} trainings List of custom trainings from backend
 * @returns {Array} List of sectors with updated moduleCount
 */
export const getVisibleSectorsWithStats = (currentUser, sectors, trainings) => {
  const isMaster = currentUser?.role === 'master';
  
  const filteredSectors = isMaster
    ? sectors
    : sectors.filter((sector) => canAccessSector(currentUser, sector.id));
    
  const builtinTrainings = getBuiltinTrainings(filteredSectors);
  const customTrainingKeys = new Set(
    trainings.map((training) => `${training.departmentId}:${String(training.moduleId)}:${training.level}`)
  );

  return filteredSectors.map((sector) => {
    const customForSector = trainings.filter((t) => t.departmentId === sector.id);
    const builtinForSector = builtinTrainings.filter((t) => (
      t.departmentId === sector.id && 
      !customTrainingKeys.has(`${t.departmentId}:${String(t.moduleId)}:${t.level}`)
    ));

    return {
      ...sector,
      moduleCount: customForSector.length + builtinForSector.length,
    };
  });
};

/**
 * Hook version of the stats calculator for React components.
 */
export const useVisibleSectorsWithStats = (currentUser, sectors, trainings) => {
  return useMemo(
    () => getVisibleSectorsWithStats(currentUser, sectors, trainings),
    [currentUser, sectors, trainings]
  );
};
