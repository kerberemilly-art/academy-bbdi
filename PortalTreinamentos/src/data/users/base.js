import { MASTER_USER, normalizeStoredUser, readStoredUsers, writeUsers } from './shared';

export const getUsers = () => {
  const users = readStoredUsers().map(normalizeStoredUser).filter(Boolean);
  const hasMaster = users.some((user) => user.id === MASTER_USER.id);
  const normalizedUsers = hasMaster ? users : [MASTER_USER, ...users];
  const uniqueUsers = Array.from(
    new Map(normalizedUsers.map((user) => [user.id, user])).values(),
  ).map(normalizeStoredUser).filter(Boolean);

  if (!hasMaster || uniqueUsers.length !== users.length) {
    writeUsers(uniqueUsers);
  }

  return uniqueUsers;
};
