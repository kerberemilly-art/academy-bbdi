import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ module }) => {
  const Icon = module.icon;
  const navigate = useNavigate();
  
  return (
    <div 
      className="product-card glass-panel"
      onClick={() => navigate(`/module/${module.id}`)}
      style={{ cursor: 'pointer' }}
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
          <p>{module.count} Módulos Disponíveis</p>
        </div>
        
        <div className="card-action">
          <ChevronRight size={20} color="var(--text-secondary)" />
        </div>
      </div>
      
      <div className="progress-bar-container">
        <div 
          className="progress-bar" 
          style={{ width: `${module.progress}%`, backgroundColor: module.color }}
        />
      </div>
    </div>
  );
};

export default ProductCard;
