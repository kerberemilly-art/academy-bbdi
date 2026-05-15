import { MASTER_USER, readStoredUsers, writeUsers } from './shared';

export const getUsers = () => {
  const users = readStoredUsers();
  const hasMaster = users.some((user) => user.id === MASTER_USER.id);
  const normalizedUsers = hasMaster
    ? users.map((user) => (user.id === MASTER_USER.id ? { ...MASTER_USER, ...user, ...MASTER_USER } : user))
    : [MASTER_USER, ...users];

  writeUsers(normalizedUsers);
  return normalizedUsers;
};
