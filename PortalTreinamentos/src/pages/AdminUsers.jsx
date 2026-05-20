import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BarChart3,
  CheckCircle,
  EllipsisVertical,
  PencilLine,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { createUser, deleteUser, getUsers, setUserActive, updateUser, updateUserDepartments } from '../data/usersStorage';
import { sectorsData } from '../data/sectorsData';
import { getUserDepartmentIds, getUserDepartmentLabels } from '../data/sectorAccess';
import './AdminUsers.css';

const formatDate = (date) => new Intl.DateTimeFormat('pt-BR').format(new Date(date));

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState(() => getUsers());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    departmentIds: ['marketing-produtos'],
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingScope, setEditingScope] = useState(null);
  const [departmentFilterId, setDepartmentFilterId] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [openActionsUserId, setOpenActionsUserId] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const isEditing = Boolean(editingUserId);
  const isEditingAreas = editingScope === 'areas';
  const allDepartmentIds = sectorsData.map((sector) => sector.id);
  const editingUser = useMemo(
    () => users.find((user) => user.id === editingUserId) ?? null,
    [editingUserId, users],
  );

  const collaborators = useMemo(
    () => users.filter((user) => user.role !== 'master'),
    [users],
  );

  const visibleUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const matchesDepartment = departmentFilterId === 'all'
        || user.role === 'master'
        || getUserDepartmentIds(user).includes(departmentFilterId);

      const matchesSearch = !normalizedSearch
        || user.name.toLowerCase().includes(normalizedSearch)
        || user.email.toLowerCase().includes(normalizedSearch);

      return matchesDepartment && matchesSearch;
    });
  }, [departmentFilterId, searchTerm, users]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleDepartmentToggle = (departmentId) => {
    setFormData((current) => {
      const isSelected = current.departmentIds.includes(departmentId);
      const nextDepartmentIds = isSelected
        ? current.departmentIds.filter((currentId) => currentId !== departmentId)
        : [...current.departmentIds, departmentId];

      return {
        ...current,
        departmentIds: nextDepartmentIds.length > 0 ? nextDepartmentIds : current.departmentIds,
      };
    });
  };

  const handleSelectAllDepartments = () => {
    setFormData((current) => ({
      ...current,
      departmentIds: allDepartmentIds,
    }));
  };

  const handleClearDepartments = () => {
    setFormData((current) => ({
      ...current,
      departmentIds: ['marketing-produtos'],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = isEditing
      ? updateUser(editingUserId, formData)
      : createUser(formData);

    if (!result.ok) {
      setFeedback({ type: 'error', message: result.error });
      return;
    }

    setUsers(getUsers());
    setEditingUserId(null);
    setFormData({ name: '', email: '', password: '', departmentIds: ['marketing-produtos'] });
    setFeedback({
      type: 'success',
      message: isEditing
        ? `Usuário ${result.user.email} atualizado com sucesso.`
        : `Usuário ${result.user.email} cadastrado com sucesso.`,
    });
  };

  const handleToggleActive = (user) => {
    setOpenActionsUserId(null);
    setUsers(setUserActive(user.id, !user.active));
  };

  const handleDelete = (user) => {
    if (editingUserId === user.id) {
      setEditingUserId(null);
      setFormData({ name: '', email: '', password: '', departmentIds: ['marketing-produtos'] });
    }

    setOpenActionsUserId(null);
    setUsers(deleteUser(user.id));
    setFeedback({ type: 'success', message: `Usuário ${user.email} removido.` });
  };

  const handleQuickRemoveDepartment = (user, departmentId) => {
    const currentDepartmentIds = user.departmentIds?.length > 0
      ? user.departmentIds
      : user.departmentId
        ? [user.departmentId]
        : ['marketing-produtos'];

    if (currentDepartmentIds.length <= 1) {
      setFeedback({
        type: 'error',
        message: `O colaborador ${user.name} precisa manter pelo menos uma área liberada.`,
      });
      return;
    }

    const nextDepartmentIds = currentDepartmentIds.filter((currentId) => currentId !== departmentId);
    const result = updateUserDepartments(user.id, nextDepartmentIds);

    if (!result.ok) {
      setFeedback({ type: 'error', message: result.error });
      return;
    }

    setUsers(getUsers());
    setFeedback({
      type: 'success',
      message: `Área removida de ${user.name}.`,
    });
  };

  const handleEdit = (user, scope = 'details') => {
    setEditingUserId(user.id);
    setEditingScope(scope);
    setOpenActionsUserId(null);
    setFormData({
      name: user.name ?? '',
      email: user.email ?? '',
      password: '',
      departmentIds: user.departmentIds?.length > 0
        ? user.departmentIds
        : user.departmentId
          ? [user.departmentId]
          : ['marketing-produtos'],
    });
    setFeedback({ type: '', message: '' });
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditingScope(null);
    setOpenActionsUserId(null);
    setFormData({ name: '', email: '', password: '', departmentIds: ['marketing-produtos'] });
    setFeedback({ type: '', message: '' });
  };

  const toggleUserActions = (userId) => {
    setOpenActionsUserId((current) => (current === userId ? null : userId));
  };

  return (
    <div className="admin-users-wrapper animate-fade-in">
      <header className="admin-users-header glass-panel">
        <div className="container admin-users-header-content">
          <button className="btn-back" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={22} />
            <span>Voltar</span>
          </button>
          <div className="admin-users-title">
            <ShieldCheck size={28} color="var(--accent-color)" />
            <h2>Administração de Usuários</h2>
          </div>
        </div>
      </header>

      <main className="container admin-users-main">
        <section className="admin-summary glass-panel">
          <div>
            <span className="section-kicker">Administrador master</span>
            <h1>Cadastro de colaboradores</h1>
            <p>Crie acessos individuais por e-mail e senha para os próximos treinamentos.</p>
          </div>
          <div className="admin-summary-actions">
            <button className="btn-progress-link" onClick={() => navigate('/admin/progress')}>
              <BarChart3 size={18} />
              Acompanhar progresso
            </button>
            <div className="summary-metric glass-panel">
              <Users size={24} color="var(--accent-color)" />
              <strong>{collaborators.length}</strong>
              <span>colaboradores</span>
            </div>
          </div>
        </section>

        <div className="admin-users-layout">
          <section className="user-form-panel glass-panel">
            <div className="panel-heading">
              <UserPlus size={22} color="var(--accent-color)" />
              <h3>{isEditingAreas ? 'Editar áreas' : isEditing ? 'Editar usuário' : 'Novo usuário'}</h3>
            </div>
            {isEditing && editingUser && (
              <div className="edit-context">
                <span>
                  {isEditingAreas ? 'Editando áreas de ' : 'Editando '}
                  {editingUser.name}
                </span>
                <button type="button" className="btn-small" onClick={handleCancelEdit}>
                  Cancelar
                </button>
              </div>
            )}

            <form className="user-form" onSubmit={handleSubmit}>
              <label>
                Nome
                <input
                  type="text"
                  name="name"
                  className="input-field"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nome do colaborador"
                  readOnly={isEditingAreas}
                  required
                />
              </label>

              <label>
                E-mail
                <input
                  type="email"
                  name="email"
                  className="input-field"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="colaborador@empresa.com.br"
                  readOnly={isEditingAreas}
                  required
                />
              </label>

              <label>
                Senha inicial
                <input
                  type="password"
                  name="password"
                  className="input-field"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={isEditing ? 'Deixe em branco para manter a atual' : 'Mínimo 6 caracteres'}
                  readOnly={isEditingAreas}
                  minLength={isEditing && formData.password ? 6 : undefined}
                  required={!isEditing}
                />
              </label>

              <div className="department-selector">
                <div className="department-selector-header">
                  <div>
                    <span className="field-label">Área do colaborador</span>
                    <p className="field-hint">
                      Selecione uma ou mais áreas.
                    </p>
                  </div>
                  <div className="department-selector-actions">
                    <button type="button" className="btn-small" onClick={handleSelectAllDepartments}>
                      Todas
                    </button>
                    <button type="button" className="btn-small" onClick={handleClearDepartments}>
                      Padrão
                    </button>
                  </div>
                </div>

                <div className="department-summary">
                  <strong>{formData.departmentIds.length}</strong>
                  <span>
                    {formData.departmentIds.length === 1 ? 'área' : 'áreas'}
                  </span>
                </div>

                <div className="department-chip-grid">
                  {sectorsData.map((sector) => {
                    const checked = formData.departmentIds.includes(sector.id);
                    const Icon = sector.icon;

                    return (
                      <button
                        key={sector.id}
                        type="button"
                        className={`department-chip ${checked ? 'is-selected' : ''}`}
                        onClick={() => handleDepartmentToggle(sector.id)}
                        aria-pressed={checked}
                        title={sector.description}
                      >
                        <span
                          className="department-chip-icon"
                          style={{
                            backgroundColor: `${sector.color}18`,
                            color: sector.color,
                            borderColor: `${sector.color}30`,
                          }}
                        >
                          <Icon size={14} />
                        </span>
                        <span className="department-chip-label">{sector.title}</span>
                        <span className={`department-chip-check ${checked ? 'is-selected' : ''}`}>
                          {checked ? <CheckCircle size={12} /> : '+'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {isEditingAreas && (
                  <span className="field-hint emphasis">
                    No modo de edição de áreas, os dados cadastrais ficam bloqueados.
                  </span>
                )}
              </div>

              {feedback.message && (
                <div className={`admin-feedback ${feedback.type}`}>
                  {feedback.type === 'success' && <CheckCircle size={18} />}
                  <span>{feedback.message}</span>
                </div>
              )}

              <button className="btn-primary user-submit" type="submit">
                {isEditing ? <PencilLine size={18} /> : <Plus size={18} />}
                {isEditing ? (isEditingAreas ? 'Salvar áreas' : 'Salvar alterações') : 'Cadastrar usuário'}
              </button>
            </form>
          </section>

          <section className="users-list-panel glass-panel">
            <div className="panel-heading">
              <Users size={22} color="var(--accent-color)" />
              <h3>Usuários cadastrados</h3>
            </div>

            <div className="list-toolbar">
              <div className="toolbar-left">
                <label className="filter-field">
                  Buscar colaborador
                  <div className="search-box">
                    <Search size={16} />
                    <input
                      type="search"
                      className="input-field"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Nome ou e-mail"
                    />
                  </div>
                </label>
                <label className="filter-field">
                  Filtrar por área
                  <select
                    className="input-field"
                    value={departmentFilterId}
                    onChange={(event) => setDepartmentFilterId(event.target.value)}
                  >
                    <option value="all">Todos os departamentos</option>
                    {sectorsData.map((sector) => (
                      <option key={sector.id} value={sector.id}>
                        {sector.title}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <span className="filter-summary">
                {visibleUsers.filter((user) => user.role !== 'master').length} colaboradores exibidos
              </span>
            </div>

            <div className="users-list">
              {visibleUsers.map((user) => (
                <div
                  key={user.id}
                  className={`user-row${editingUserId === user.id ? ' is-editing' : ''}`}
                >
                  <div className="user-identity">
                    <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                    <div>
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                      <small>
                        {getUserDepartmentLabels(user).length}
                        {' '}
                        {getUserDepartmentLabels(user).length === 1 ? 'área liberada' : 'áreas liberadas'}
                      </small>
                    </div>
                  </div>

                  <div className="user-meta">
                    <span className={`role-badge ${user.role}`}>
                      {user.role === 'master' ? 'Master' : 'Colaborador'}
                    </span>
                    <span className={`status-badge ${user.active ? 'active' : 'inactive'}`}>
                      {user.active ? 'Ativo' : 'Inativo'}
                    </span>
                    <div className="department-badges">
                      {getUserDepartmentIds(user).map((departmentId) => {
                        const departmentLabel = sectorsData.find((sector) => sector.id === departmentId)?.title ?? departmentId;

                        return (
                          <span key={`${user.id}-${departmentId}`} className="department-badge">
                            {departmentLabel}
                            {user.role !== 'master' && (
                              <button
                                type="button"
                                className="department-badge-remove"
                                title={`Remover ${departmentLabel}`}
                                onClick={() => handleQuickRemoveDepartment(user, departmentId)}
                              >
                                <X size={12} />
                              </button>
                            )}
                          </span>
                        );
                      })}
                    </div>
                    <span className="created-date">Criado em {formatDate(user.createdAt)}</span>
                  </div>

                  <div className="user-actions">
                    {user.role !== 'master' && (
                      <div className="user-actions-menu">
                        <button
                          type="button"
                          className="btn-icon-menu"
                          title="Abrir ações"
                          onClick={() => toggleUserActions(user.id)}
                        >
                          <EllipsisVertical size={18} />
                        </button>

                        {openActionsUserId === user.id && (
                          <div className="user-actions-popover">
                            <button
                              type="button"
                              className="btn-small"
                              onClick={() => handleEdit(user)}
                            >
                              Editar dados
                            </button>
                            <button
                              type="button"
                              className="btn-small"
                              onClick={() => handleEdit(user, 'areas')}
                            >
                              Editar áreas
                            </button>
                            <button
                              type="button"
                              className="btn-small"
                              onClick={() => handleToggleActive(user)}
                            >
                              {user.active ? 'Desativar' : 'Ativar'}
                            </button>
                            <button
                              type="button"
                              className="btn-small btn-danger-ghost"
                              title="Remover usuário"
                              onClick={() => handleDelete(user)}
                            >
                              <Trash2 size={16} />
                              Remover
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;
