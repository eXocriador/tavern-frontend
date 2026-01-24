import type { InstanceZone } from '../../api/instances';
import { useLanguage } from '../../context/LanguageContext';
import './InstanceCard.css';

interface InstanceCardProps {
  instance: InstanceZone;
  isVisited: boolean;
  isUpdating?: boolean;
  onMarkAsPassed?: (instance: InstanceZone) => void;
  onCreateParty?: (instance: InstanceZone) => void;
}

const InstanceCard = ({
  instance,
  isVisited,
  isUpdating = false,
  onMarkAsPassed,
  onCreateParty,
}: InstanceCardProps) => {
  const { t } = useLanguage();

  if (isVisited) {
    return (
      <div className="instance-card visited">
        <div className="instance-info">
          <h3>{instance.name}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="instance-card">
      <div className="instance-info">
        <h3>{instance.name}</h3>
      </div>
      <div className="instance-actions">
        {onMarkAsPassed && (
          <button
            type="button"
            className="btn-visit-toggle btn-visit-toggle-dimmed"
            onClick={e => {
              e.stopPropagation();
              onMarkAsPassed(instance);
            }}
            disabled={isUpdating}
            title={t('dashboard.markAsPassed')}
          >
            {isUpdating ? (
              <span className="loading-spinner">...</span>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-label={t('dashboard.markAsPassed')}
              >
                <title>{t('dashboard.markAsPassed')}</title>
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            )}
          </button>
        )}
        {onCreateParty && (
          <button
            type="button"
            className="btn-create-party"
            onClick={e => {
              e.stopPropagation();
              onCreateParty(instance);
            }}
            title={t('party.create')}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-label={t('party.create')}
            >
              <title>{t('party.create')}</title>
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default InstanceCard;
