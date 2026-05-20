import { sectorsData } from './sectorsData';

export const DEFAULT_COLLABORATOR_DEPARTMENT_ID = 'marketing-produtos';
export const DEFAULT_ADMIN_ROLE = 'admin';

export const getDepartmentById = (departmentId) => (
  sectorsData.find((sector) => sector.id === departmentId) ?? null
);

export const getDepartmentLabel = (departmentId) => (
  getDepartmentById(departmentId)?.title ?? 'Marketing de Produtos'
);

export const getNormalizedDepartmentId = (departmentId) => (
  getNormalizedDepartmentIds(departmentId)[0]
);

export const getNormalizedDepartmentIds = (departmentIds) => {
  const rawDepartmentIds = Array.isArray(departmentIds)
    ? departmentIds
    : departmentIds
      ? [departmentIds]
      : [];

  const normalizedDepartmentIds = rawDepartmentIds
    .map((departmentId) => getDepartmentById(departmentId)?.id)
    .filter(Boolean);

  const uniqueDepartmentIds = [...new Set(normalizedDepartmentIds)];

  return uniqueDepartmentIds.length > 0
    ? uniqueDepartmentIds
    : [DEFAULT_COLLABORATOR_DEPARTMENT_ID];
};

export const getUserDepartmentIds = (user) => (
  user?.role === 'master'
    ? []
    : getNormalizedDepartmentIds(user?.departmentIds ?? user?.departmentId ?? DEFAULT_COLLABORATOR_DEPARTMENT_ID)
);

export const getUserDepartmentId = (user) => getUserDepartmentIds(user)[0] ?? null;

export const getDepartmentLabels = (departmentIds) => (
  getNormalizedDepartmentIds(departmentIds)
    .map((departmentId) => getDepartmentLabel(departmentId))
);

export const getUserDepartmentLabels = (user) => getDepartmentLabels(getUserDepartmentIds(user));

export const getUserDepartmentSummary = (user) => {
  const departmentLabels = getUserDepartmentLabels(user);
  return departmentLabels.length > 0 ? departmentLabels.join(', ') : 'Sem departamento';
};

export const isSuperAdmin = (user) => user?.role === 'master';

export const isSectorAdmin = (user) => user?.role === 'admin';

export const canAccessAdminArea = (user) => isSuperAdmin(user) || isSectorAdmin(user);

export const canManageSector = (user, sectorId) => {
  if (isSuperAdmin(user)) {
    return true;
  }

  if (!isSectorAdmin(user)) {
    return false;
  }

  return getUserDepartmentIds(user).includes(sectorId);
};

export const canAccessSector = (user, sectorId) => {
  if (isSuperAdmin(user)) {
    return true;
  }

  return getUserDepartmentIds(user).includes(sectorId);
};
