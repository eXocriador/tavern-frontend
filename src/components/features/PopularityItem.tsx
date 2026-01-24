import { useLanguage } from '../../context/LanguageContext';
import './PopularityItem.css';

interface PopularityItemProps {
  rank: number;
  zoneName: string;
  visits: number;
}

const PopularityItem = ({ rank, zoneName, visits }: PopularityItemProps) => {
  const { t } = useLanguage();

  return (
    <div className="popularity-item">
      <span className="rank">#{rank}</span>
      <span className="zone-name">{zoneName}</span>
      <span className="visit-count">
        {visits} {t('statistics.visits')}
      </span>
    </div>
  );
};

export default PopularityItem;
