import { useLanguage } from '../../context/LanguageContext';
import './DashboardStats.css';

interface DashboardStatsProps {
  totalInstances: number;
  visitedCount: number;
}

const DashboardStats = ({ totalInstances, visitedCount }: DashboardStatsProps) => {
  const { t } = useLanguage();
  const availableCount = totalInstances - visitedCount;
  const progress = totalInstances > 0 ? Math.round((visitedCount / totalInstances) * 100) : 0;

  return (
    <div className="dashboard-stats-compact">
      <div className="stat-compact">
        <span className="stat-compact-label">{t('dashboard.passed')}:</span>
        <span className="stat-compact-value">{visitedCount}</span>
      </div>
      <div className="stat-compact">
        <span className="stat-compact-label">{t('dashboard.available')}:</span>
        <span className="stat-compact-value">{availableCount}</span>
      </div>
      <div className="stat-compact">
        <span className="stat-compact-label">{t('dashboard.progress')}:</span>
        <span className="stat-compact-value">{progress}%</span>
      </div>
    </div>
  );
};

export default DashboardStats;
