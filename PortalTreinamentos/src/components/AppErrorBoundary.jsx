import { Component } from 'react';

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Erro de renderização no portal:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="app-error-screen">
          <section className="app-error-card glass-panel">
            <span className="section-kicker">Erro na tela</span>
            <h1>A página encontrou um problema.</h1>
            <p>{this.state.error.message || 'Erro inesperado ao renderizar a interface.'}</p>
            <button type="button" className="btn-primary" onClick={() => window.location.reload()}>
              Recarregar página
            </button>
          </section>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;

