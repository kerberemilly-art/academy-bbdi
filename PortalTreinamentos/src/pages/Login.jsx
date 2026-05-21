import { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { MASTER_CREDENTIALS } from '../data/usersStorage';
import './Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const success = onLogin(email, password);
      if (!success) {
        setError('E-mail ou senha inválidos. Verifique suas credenciais corporativas.');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="login-wrapper">
      <div className="login-container glass-panel animate-fade-in">
        <header className="login-header">
          <div className="bbdi-logo-mark login-logo">
            <span className="bbdi-logo-bb">BBDI</span>
            <span className="bbdi-logo-academy">ACADEMY</span>
          </div>
          <p className="login-tagline">Sistema de Gestão de Conhecimento Técnico</p>
          <h1>Acesse sua conta</h1>
        </header>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>E-mail Corporativo</label>
            <div className="input-group">
              <Mail className="input-icon" size={20} />
              <input 
                type="email" 
                className="input-field with-icon" 
                placeholder="seu.nome@bbdi.com.br" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Senha de Acesso</label>
            <div className="input-group">
              <Lock className="input-icon" size={20} />
              <input 
                type="password" 
                className="input-field with-icon" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="btn-highlight login-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Autenticando...' : 'Acessar Plataforma'}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>
        
        <footer className="login-footer">
          <div className="security-note">
             <ShieldCheck size={14} />
             <span>Acesso Restrito a Colaboradores Grupo BBDI</span>
          </div>
          <p className="master-hint">Acesso master: {MASTER_CREDENTIALS.email}</p>
        </footer>
      </div>
    </div>
  );
};

export default Login;
