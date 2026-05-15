import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, CheckCircle, ShieldCheck, Trash2, UserPlus, Users } from 'lucide-react';
import { createUser, deleteUser, getUsers, setUserActive } from '../data/usersStorage';
import './AdminUsers.css';

const formatDate = (date) => new Intl.DateTimeFormat('pt-BR').format(new Date(date));

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState(() => getUsers());
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const collaborators = useMemo(
    () => users.filter((user) => user.role !== 'master'),
    [users],
  );

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = createUser(formData);

    if (!result.ok) {
      setFeedback({ type: 'error', message: result.error });
      return;
    }

    setUsers(getUsers());
    setFormData({ name: '', email: '', password: '' });
    setFeedback({ type: 'success', message: `Usuário ${result.user.email} cadastrado com sucesso.` });
  };

  const handleToggleActive = (user) => {
    setUsers(setUserActive(user.id, !user.active));
  };

  const handleDelete = (user) => {
    setUsers(deleteUser(user.id));
    setFeedback({ type: 'success', message: `Usuário ${user.email} removido.` });
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
        <section className="admin-summary">
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
              <h3>Novo usuário</h3>
            </div>

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
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                  required
                />
              </label>

              {feedback.message && (
                <div className={`admin-feedback ${feedback.type}`}>
                  {feedback.type === 'success' && <CheckCircle size={18} />}
                  <span>{feedback.message}</span>
                </div>
              )}

              <button className="btn-primary user-submit" type="submit">
                <UserPlus size={18} />
                Cadastrar usuário
              </button>
            </form>
          </section>

          <section className="users-list-panel glass-panel">
            <div className="panel-heading">
              <Users size={22} color="var(--accent-color)" />
              <h3>Usuários cadastrados</h3>
            </div>

            <div className="users-list">
              {users.map((user) => (
                <div key={user.id} className="user-row">
                  <div className="user-identity">
                    <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                    <div>
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                    </div>
                  </div>

                  <div className="user-meta">
                    <span className={`role-badge ${user.role}`}>
                      {user.role === 'master' ? 'Master' : 'Colaborador'}
                    </span>
                    <span className={`status-badge ${user.active ? 'active' : 'inactive'}`}>
                      {user.active ? 'Ativo' : 'Inativo'}
                    </span>
                    <span className="created-date">Criado em {formatDate(user.createdAt)}</span>
                  </div>

                  <div className="user-actions">
                    {user.role !== 'master' && (
                      <>
                        <button
                          type="button"
                          className="btn-small"
                          onClick={() => handleToggleActive(user)}
                        >
                          {user.active ? 'Desativar' : 'Ativar'}
                        </button>
                        <button
                          type="button"
                          className="btn-icon-danger"
                          title="Remover usuário"
                          onClick={() => handleDelete(user)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
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
