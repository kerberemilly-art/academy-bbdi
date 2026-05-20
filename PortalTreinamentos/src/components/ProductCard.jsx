import { ChevronRight, CheckCircle, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ module, backTo = '/dashboard', locked = false, completed = false }) => {
  const Icon = module.icon;
  const navigate = useNavigate();
  const progressValue = completed ? 100 : module.progress ?? 0;
  const handleClick = () => {
    if (locked) return;
    navigate(`/module/${module.id}`, { state: { backPath: backTo } });
  };
  
  return (
    <button
      type="button"
      className={`product-card glass-panel${locked ? ' is-locked' : ''}`}
      onClick={handleClick}
      disabled={locked}
      style={{ cursor: locked ? 'not-allowed' : 'pointer' }}
    >
      <div className="card-content">
        <div 
          className="icon-wrapper" 
          style={{ backgroundColor: `${module.color}20`, color: module.color, border: `1px solid ${module.color}40` }}
        >
          <Icon size={28} />
        </div>
        
        <div className="card-info">
          <h3>{module.title}</h3>
          <p>{module.count} níveis disponíveis</p>
        </div>
        
        <div className="card-action">
          {completed ? (
            <CheckCircle size={20} color="var(--success-color)" />
          ) : locked ? (
            <Lock size={20} color="var(--text-secondary)" />
          ) : (
            <ChevronRight size={20} color="var(--text-secondary)" />
          )}
        </div>
      </div>
      
      <div className="progress-bar-container">
        <div 
          className="progress-bar" 
          style={{ width: `${progressValue}%`, backgroundColor: module.color }}
        />
      </div>
    </button>
  );
};

export default ProductCard;
