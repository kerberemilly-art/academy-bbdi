import { ChevronRight, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { canAccessSector, getUserDepartmentIds } from '../data/sectorAccess';
import './SectorCard.css';

const SectorCard = ({ sector, currentUser }) => {
  const Icon = sector.icon;
  const navigate = useNavigate();
  const isMaster = currentUser?.role === 'master';
  const userDepartmentIds = getUserDepartmentIds(currentUser);
  const isHighlighted = userDepartmentIds.includes(sector.id);
  const isLocked = !isMaster && !canAccessSector(currentUser, sector.id);
  const label = isMaster
    ? (sector.status === 'active' ? 'Ativo' : 'Em preparação')
    : isLocked
      ? 'Bloqueado'
      : isHighlighted
        ? 'Sua área'
        : 'Liberado';

  return (
    <button
      type="button"
      className={`sector-card glass-panel${isLocked ? ' is-locked' : ''}${isHighlighted ? ' is-highlighted' : ''}`}
      onClick={() => !isLocked && navigate(`/sector/${sector.id}`)}
      disabled={isLocked}
    >
      <div className="sector-card-top">
        <div
          className="sector-icon"
          style={{
            backgroundColor: `${sector.color}18`,
            color: sector.color,
            border: `1px solid ${sector.color}30`,
          }}
        >
          <Icon size={28} />
        </div>
        <span className={`sector-badge ${isLocked ? 'is-locked' : isHighlighted ? 'is-highlighted' : 'is-active'}`}>
          {label}
        </span>
      </div>

      <div className="sector-card-body">
        <h3>{sector.title}</h3>
        <p>{sector.description}</p>
      </div>

      <div className="sector-card-footer">
        <span>
          {sector.moduleCount}
          {' '}
          {sector.moduleCount === 1 ? 'treinamento' : 'treinamentos'}
        </span>
        <span className="sector-action">
          {isLocked ? <Lock size={18} /> : <ChevronRight size={18} />}
        </span>
      </div>
    </button>
  );
};

export default SectorCard;
