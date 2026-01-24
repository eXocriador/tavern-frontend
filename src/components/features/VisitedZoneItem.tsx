import { useLanguage } from '../../context/LanguageContext';
import './VisitedZoneItem.css';

interface VisitedZoneItemProps {
  zoneName: string;
  visitCount: number;
}

const VisitedZoneItem = ({ zoneName, visitCount }: VisitedZoneItemProps) => {
  const { t } = useLanguage();

  return (
    <div className="visited-item">
      <span className="zone-name">{zoneName}</span>
      <span className="visit-count">
        {visitCount} {t('statistics.times')}
      </span>
    </div>
  );
};

export default VisitedZoneItem;
