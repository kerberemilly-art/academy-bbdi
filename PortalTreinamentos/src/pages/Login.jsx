import { useState } from 'react';
import { Lock, Mail, ArrowRight } from 'lucide-react';
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
        setError('E-mail ou senha inválidos.');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="login-wrapper">
      <div className="login-container glass-panel animate-fade-in">
        <div className="login-header">
          <div className="bbdi-logo-mark">
            <span className="bbdi-logo-bb">BBDI</span>
            <span className="bbdi-logo-divider">|</span>
            <span className="bbdi-logo-academy">ACADEMY</span>
          </div>
          <p className="login-tagline">Plataforma interna de capacitação técnica.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input 
              type="email" 
              className="input-field with-icon" 
              placeholder="E-mail" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input 
              type="password" 
              className="input-field with-icon" 
              placeholder="Senha" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="btn-primary login-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Autenticando...' : 'Acessar Plataforma'}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Acesso master inicial: {MASTER_CREDENTIALS.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
